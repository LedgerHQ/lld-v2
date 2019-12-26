# LLD-V2 REWORK

## DEVTOOLS

### VSCode

If you use VSCode, you might need to configure it correctly to have flow / eslint / prettier working nicely together  
Go to your workspace settings and set it up like so:


```json
{
  "flow.enabled": true,
  "flow.useNPMPackagedFlow": true,
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "javascript.format.enable": false,
  "javascript.validate.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```