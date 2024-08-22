#!/bin/bash
PREVIEW_LIST=""
API_KEY=""
OWNER="jmp-hlx"
REPO="jmp-da"
REF="main"
for PATH in ${PREVIEW_LIST}; do
    echo "Preview request sent for ${PATH}"
    curl https://admin.hlx.page/preview/${OWNER}/${REPO}/${REF}/{path} -H "authorization: token $API_KEY"
done
