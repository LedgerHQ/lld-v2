# LLD-V2 REWORK

## DEVTOOLS

### VSCode

If you use VSCode, you need to configure your editor with a `jsconfig.json` file at the root directory of the project. Please add this file to your **global** .gitignore 

jsconfig.json
```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "allowSyntheticDefaultImports": false,
    "baseUrl": "./",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```