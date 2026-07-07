```json
{
    ///////Conveniencia
    "workbench.editor.enablePreview": false, //abre archivos de una

    ///excluir archivos
    "files.exclude": {
        "": true,
        "**/4-next/*": true, //ocultamos toda la carpeta
        "**/4-next/src/": false, //exepciones
        "**/4-next/0-personal-docs": false, //exepciones
        "**/.next": true
    },
    
    /////Estilos de la zona de trabajo
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": ["punctuation.separator.table.markdown"],
                "settings": {
                    "foreground": "#267291"
                }
            }
        ]
    },
    "workbench.colorCustomizations": {
        "editorHoverWidget.border": "#ff0000",
        //
        "editorIndentGuide.background1": "#ffff4080",
        "editorIndentGuide.background2": "#7FFF7F80",
        "editorIndentGuide.background3": "#FF7FFF80",
        "editorIndentGuide.background4": "#4FECEC80",
        "editorIndentGuide.background5": "#FFC0CB80",
        "editorIndentGuide.background6": "#ADD8E680",
        "editorIndentGuide.activeBackground1": "#FFFF40D0",
        "editorIndentGuide.activeBackground2": "#7FFF7FD0",
        "editorIndentGuide.activeBackground3": "#FF7FFFD0",
        "editorIndentGuide.activeBackground4": "#4FECECD0",
        "editorIndentGuide.activeBackground5": "#FFC0CBD0",
        "editorIndentGuide.activeBackground6": "#add8e6d0",
        //
        "tree.indentGuidesStroke": "#2382238a",
        "tree.inactiveIndentGuidesStroke": "#778f18",
        //
        "tab.activeBackground": "#18228f", /// style tab background
        //
        "editorWhitespace.foreground": "#ffa500" //style color espacio en blanco
        //
    },

    ///////////////////// requieren plugings
    ///////////////////// identRaimbow
    "indentRainbow.colors": [
        "rgba(255,255,64,0.07)",
        "rgba(127,255,127,0.07)",
        "rgba(255,127,255,0.07)",
        "rgba(79,236,236,0.07)"
    ],
    ///////////////plantUml
    "editor.renderWhitespace": "none", //ver espacios en blanco
    "files.autoSave": "afterDelay", //auto save
    "markdown-preview-enhanced.plantumlServer": "https://kroki.io/plantuml/svg/" ///servidor de plantum para visualizaion
}
```
