
# Atajo de comandos de vs

- `Ctrl+Shift+O || Cmd+P (and type an @) outline  `

- `Ctrl + Shift + x extencions`

- `Ctrl + alt + z extencions`

- `Ctrl+, abre las preferencias`

- `Ctrl+Alt+Down multiple cursores`

- `Ctrl+(1,2,3,...)) cambio de editor interno`

{
  "key": "ctrl+alt+meta+n",
  "command": "welcome.showNewFileEntries"
}

```Json
[
  {
    "key": "ctrl+k ctrl+[Comma]",
    "command": "editor.createFoldingRangeFromSelection",
    "when": "editorTextFocus && foldingEnabled"
  }, ,
  {
    "key": "ctrl+k ctrl+[Period]",
    "command": "editor.removeManualFoldingRanges",
    "when": "editorTextFocus && foldingEnabled"
  }, ,
  ///////// personales
  {
    "key": "alt+w alt+w",
    "command": "editor.action.toggleRenderWhitespace"//muestra espacios en blanco
  },
  {
    "key": "ctrl+m ctrl+m",
    "command": "markdownlint.fixAll"//arregla los problemas markdown
  },
  {
    "key": "ctrl+m ctrl+l",
    "command": "markdown.showLockedPreviewToSide"
  },
  {
    "key": "alt+s",
    "command": "workbench.action.toggleAutoSave"//apaga el auto save
  },
  {
    "key": "ctrl+e ctrl+r",//mueve arvhico para editor de la la derecha
    "command": "workbench.action.moveEditorToRightGroup"
  },

  ////editados
  {
    "key": "ctrl+alt+r",//ctrl+k ctrl+s
    "command": "workbench.action.openGlobalKeybindings"
  },
  {
    "key": "ctrl+alt+c",//ctrl+k ctrl+u
    "command": "editor.action.addCommentLine",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+alt+u",//ctrl+k ctrl+u
    "command": "editor.action.addCommentLine",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+alt+o",//"ctrl+shift+o",
    "command": "editor.action.accessibleViewGoToSymbol",
    "when": "accessibilityHelpIsShown && accessibleViewGoToSymbolSupported || accessibleViewGoToSymbolSupported && accessibleViewIsShown"
  },
  {
    "key": "ctrl+alt+o",// "key": "ctrl+alt+o",
    "command": "workbench.action.gotoSymbol",
    "when": "!accessibilityHelpIsShown && !accessibleViewIsShown"
  },
  {
    "key": "ctrl+shift+p",
    "command": "workbench.action.showCommands"
  },
  /////eliminados
  {
    "key": "ctrl+alt+o",
    "command": "workbench.action.remote.showMenu"
  },
]
//////////////////////////////////
´´´
