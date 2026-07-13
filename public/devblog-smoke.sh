#!/usr/bin/env bash
#
# DevBlog GraphQL API smoke test — drives the whole content lifecycle with curl + jq.
# Bring the stack up first (`docker compose up`), then run:  bash devblog-smoke.sh
#
# Requires: curl, jq.  Override the endpoint with:  API=http://localhost:4000/graphql bash devblog-smoke.sh
set -euo pipefail

API="${API:-http://localhost:4000/graphql}"
EMAIL="author+$(date +%s)@devblog.dev"   # unique each run so re-runs don't hit "email taken"
PASSWORD="correct-horse"
TOKEN=""

say() { printf '\n\033[1;32m▶ %s\033[0m\n' "$1"; }

# gql <query> <variables-json> → prints the `data` object (fails loudly on GraphQL errors)
gql() {
  local body resp
  body=$(jq -n --arg q "$1" --argjson v "${2:-{}}" '{query:$q, variables:$v}')
  resp=$(curl -s -X POST "$API" -H 'Content-Type: application/json' \
    ${TOKEN:+-H "Authorization: Bearer $TOKEN"} -d "$body")
  if echo "$resp" | jq -e '.errors' >/dev/null 2>&1; then
    echo "GraphQL error:" >&2; echo "$resp" | jq '.errors' >&2; exit 1
  fi
  echo "$resp" | jq '.data'
}

say "Register ($EMAIL)"
TOKEN=$(gql 'mutation($input: RegisterInput!){ register(input:$input){ token user{ id displayName role } } }' \
  "$(jq -n --arg e "$EMAIL" --arg p "$PASSWORD" '{input:{email:$e,password:$p,displayName:"Ava Author"}}')" \
  | jq -r '.register.token')
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || { echo "register failed"; exit 1; }
echo "token: ${TOKEN:0:24}…"

say "Create a tag"
gql 'mutation($name:String!){ createTag(name:$name){ id name slug } }' '{"name":"NestJS"}' | jq -c '.createTag'

say "Create a draft post"
CREATE=$(gql 'mutation($input: CreatePostInput!){ createPost(input:$input){ id slug status } }' \
  '{"input":{"title":"Hello, DevBlog","body":"This is the **first** post.","tags":["nestjs","graphql"]}}')
POST_ID=$(echo "$CREATE" | jq -r '.createPost.id')
POST_SLUG=$(echo "$CREATE" | jq -r '.createPost.slug')
echo "$CREATE" | jq -c '.createPost'

say "Publish it"
gql 'mutation($id: ID!){ publishPost(id:$id){ id status publishedAt } }' \
  "$(jq -n --arg id "$POST_ID" '{id:$id}')" | jq -c '.publishPost'

say "Public posts (published only)"
gql 'query{ posts(status: PUBLISHED){ total items{ title slug status } } }' | jq -c '.posts'

say "Add a comment (starts as pending)"
gql 'mutation($postId: ID!, $input: AddCommentInput!){ addComment(postId:$postId, input:$input){ id authorName status } }' \
  "$(jq -n --arg id "$POST_ID" '{postId:$id, input:{authorName:"Alex",authorEmail:"alex@example.com",body:"Great post!"}}')" \
  | jq -c '.addComment'

say "Read the post by slug (approved comments only — pending one is hidden)"
gql 'query($slug:String!){ post(slug:$slug){ title author{ displayName } comments{ authorName body status } } }' \
  "$(jq -n --arg s "$POST_SLUG" '{slug:$s}')" | jq '.post'

say "Done ✅  (post $POST_SLUG)"
echo "Note: approving the comment needs an ADMIN user (moderateComment is @Roles('admin'))."
echo "      Promote your user in mongosh — see the Docker module's compose-full lesson."
