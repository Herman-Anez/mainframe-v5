```json
{
    ////* Personal config
    "workbench.editor.enablePreview": false, //abre archivos de una
    "workbench.editor.revealIfOpen": true, //abre archivo en editor
    ///*file exclusion
    "files.exclude": {
        "": true,
        "**/4-next/*": true, //ocultamos toda la carpeta
        "**/4-next/src/": false, //exepciones
        "**/4-next/0-personal-docs": false, //exepciones
        "**/.next": true
    },

    //////* Configuracion visual de editor
    "workbench.tree.indent": 10, //identacion del arbol de navegador
    "workbench.tree.stickyScrollMaxItemCount": 11, //stickyScrollMaxItemCount
    //////* Configuracion visual de editor

    //////////////////////////////////////////////* styles START

    "editor.tokenColorCustomizations": {
        "comments": "#829018", //color de los comentarios
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
        //LINEAS DE COLORES DEL EDITOR
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
        //********terminal
        "terminal.background": "#0a1734", //color terminal
        //"terminal.foreground": "#0050fc",//color terminal secundario
        "panel.background": "#120f3e", //COLOR DEL PANEL INFERIOR
        //********terminal
        //"button.background": "#ffa500", color de botonoes
        "tab.activeBackground": "#18228f", //color de la tab activa
        "editorWhitespace.foreground": "#ffa500", //color del espaciado en blanco
        "editorGroupHeader.border": "#ffa500",
        "editorGroup.border": "#ffa500",
        "editor.lineHighlightBorder": "#9898c0", /// resaltamiento de linea actual
        "panel.border": "#ffa500", //BORDE DEL PANEL INFERIOR
        "breadcrumb.foreground": "#ffa500" //breadcrumb color
        //"editorStickyScroll.background": "#122698",//color del sticky scroll
        //"editorGroup.emptyBackground": "#ffa500",//color de editor vacio
    },
    "workbench.colorTheme": "Tokyo Night Storm",
    "editor.defaultColorDecorators": "never",

    "markdown-preview-enhanced.previewTheme": "atom-dark.css",

    ////////////////////////////////////* PLUGINS Start
    //////////////////$ Better Comments  Start
    "better-comments.tags": [
        {
            "tag": "$",
            "color": "#EAFF00CF",
            "strikethrough": false,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        },
        {
            "tag": "!",
            "color": "#FF2D00",
            "strikethrough": false,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        },
        {
            "tag": "?",
            "color": "#3498DB",
            "strikethrough": false,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        },
        {
            "tag": "//",
            "color": "#474747",
            "strikethrough": true,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        },
        {
            "tag": "todo",
            "color": "#FF8C00",
            "strikethrough": false,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        },
        {
            "tag": "*",
            "color": "#98C379",
            "strikethrough": false,
            "underline": false,
            "backgroundColor": "transparent",
            "bold": false,
            "italic": false
        }
    ],
    //////////////////// *Better Comments  End
    //*
    //////////////////// *indentRainbow  Start
    "indentRainbow.colors": [
        "rgba(126 59 59 / 0.07)",
        "rgba(127,255,127,0.07)",
        "rgba(255,127,255,0.07)",
        "rgba(79,236,236,0.07)"
    ],
    //////////////////// *indentRainbow  End
    //////////////////////////////////// *PLUGINS End
    //////////////////////////////////////////////*  styles END

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
