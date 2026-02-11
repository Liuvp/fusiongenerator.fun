#!/bin/bash

# 检查 API 返回的配额信息
echo "正在测试匿名用户 API..."

curl -s https://fusiongenerator.fun/api/get-quota \
  -H "User-Agent: Mozilla/5.0" \
  | jq '.'

echo ""
echo "如果 remaining 是 3，说明 Vercel 还没部署新代码"
echo "如果 remaining 是 1，说明代码已部署"
