#!/bin/bash
# SEO Meta标签位置验证脚本

echo "🔍 检查生产环境的Meta标签位置..."
echo ""

# 检查/pokemon页面
echo "📋 检查 /pokemon 页面:"
curl -s https://fusiongenerator.fun/pokemon | grep -n -A 5 "</body>" | head -20
echo ""
echo "---"
echo ""

# 检查meta标签是否在head中
echo "✅ Meta标签在<head>中的数量:"
curl -s https://fusiongenerator.fun/pokemon | awk '/<head>/,/<\/head>/' | grep -c '<meta'
echo ""

echo "❌ Meta标签在</body>之后的数量:"
curl -s https://fusiongenerator.fun/pokemon | awk '/<\/body>/,/<\/html>/' | grep -c '<meta'
echo ""

echo "📊 Title标签位置:"
curl -s https://fusiongenerator.fun/pokemon | grep -n '<title>'
echo ""

echo "✅ 完成！如果</body>之后有meta标签，则需要修复。"
