Ctrl + Shift + P
Developer: Inspect Editor Tokens and Scopes
Developer: Toggle Developer Tools

```json
{
"workbench.colorCustomizations": {
    "editorHoverWidget.border": "#ff0000",//BORDE DE LOS MODALES QUE APARECEN
    //
    "editorIndentGuide.background1": "#ffff4080",             // 
    "editorIndentGuide.background2": "#7FFF7F80",             //
    "editorIndentGuide.background3": "#FF7FFF80",             //
    "editorIndentGuide.background4": "#4FECEC80",             //
    "editorIndentGuide.background5": "#FFC0CB80",             //
    "editorIndentGuide.background6": "#ADD8E680",             //
    "editorIndentGuide.activeBackground1": "#FFFF40D0",       //
    "editorIndentGuide.activeBackground2": "#7FFF7FD0",       //
    "editorIndentGuide.activeBackground3": "#FF7FFFD0",       //
    "editorIndentGuide.activeBackground4": "#4FECECD0",       //
    "editorIndentGuide.activeBackground5": "#FFC0CBD0",       //
    "editorIndentGuide.activeBackground6": "#add8e6d0",       //
    //
    "tree.indentGuidesStroke": "#2382238a",
    "tree.inactiveIndentGuidesStroke": "#778f18",
    
 ,  //
    "tab.activeBackground": "#18228f",//COLOR DE LA TAB ACTIVA
    //
    "editor.minimap.enabled": false,
    "editor.wordWrap": "on",
    "editorWhitespace.foreground": "#ffa500",//color de los espacios en blanco
    "editorGroupHeader.border": "#ffa500",//borde superior del editor
    "editorGroup.border": "#ffa500",//borde lateral del editor,
    "editor.lineHighlightBorder": "#ffa500",//linea donde uno esta ubicado
    "menu.border": "#ffa500",//BORDE DE LOS MENUS
    "panel.border": "#ffa500",//BORDE DEL PANEL INFERIOR
    "breadcrumb.foreground": "#ffa500",//breadcrumb color
},
"editor.tokenColorCustomizations": {
    "textMateRules": [
        {
            "scope": "punctuation.definition.table.markdown", // You can try targeting the class directly
            "settings": {
                "foreground": "#FF0000"
            }
        }
    ]
},
}
```

personal theme 
```json
{
	/*         #395036 background oscuro
		        #354631 background claro
		        #476245 editor focus
		        #A4C79F iconos
		        #75A16F comentarios
*/
	"workbench.colorCustomizations": {
		//Aux
		"breadcrumb.background": "#395036",
		"activityBar.background": "#395036",
		"activityBar.border": "#395036", //background color theme
		"breadcrumbPicker.background": "#395036", //background color theme
		"charts.lines": "#395036", //background color theme
		"editorBracketMatch.background": "#395036", //background color theme
		"editorGroupHeader.noTabsBackground": "#395036", //background color theme
		"editorGroupHeader.tabsBackground": "#395036", //background color theme
		"editorHoverWidget.background": "#395036", //background color theme
		"editorMarkerNavigation.background": "#395036", //background color theme
		"editorSuggestWidget.background": "#395036", //background color theme
		"editorWidget.background": "#395036", //background color theme
		"gitlens.gutterBackgroundColor": "#395036", //background color theme
		"menu.background": "#395036", //background color theme
		"notebook.cellEditorBackground": "#395036", //background color theme
		"panel.background": "#395036", //background color theme
		"panelInput.border": "#395036", //background color theme
		"peekViewEditor.background": "#395036", //background color theme
		"sideBar.background": "#395036", //background color theme
		"sideBarSectionHeader.background": "#395036", //background color theme
		"statusBar.background": "#395036", //background color theme
		"statusBar.debuggingBackground": "#395036", //background color theme
		"statusBar.noFolderBackground": "#395036", //background color theme
		"tab.inactiveBackground": "#395036", //background color theme
		"terminal.background": "#395036", //background color theme
		"textBlockQuote.background": "#395036", //background color theme
		"textCodeBlock.background": "#395036", //background color theme
		"titleBar.activeBackground": "#395036", //background color theme
		"titleBar.inactiveBackground": "#395036", //background color theme
		"walkThrough.embeddedEditorBackground": "#395036", //background color theme
		"checkbox.selectBackground": "#1f2335", //background color theme
		"commandCenter.debuggingBackground": "#1f233542", //background color theme
		"diffEditor.unchangedRegionBackground": "#1f2335", //background color 
		"editorActionList.background": "#1f2335", //background color theme
		"editorGroup.dropIntoPromptBackground": "#1f2335", //background color 
		"inlineEdit.gutterIndicator.background": "#1f233580", //background color 
		"panelStickyScroll.background": "#1f2335", //background color theme
		"peekViewEditorGutter.background": "#1f2335", //background color theme
		"peekViewEditorStickyScroll.background": "#1f2335", //background color 
		"peekViewEditorStickyScrollGutter.background": "#1f2335", //background 
		"quickInput.background": "#1f2335", //background color theme
		"sideBarStickyScroll.background": "#1f2335", //background color theme
		"sideBarTitle.background": "#1f2335", //background color theme
		"tab.unfocusedInactiveBackground": "#1f2335", //background color theme
		"welcomePage.tileBackground": "#1f2335", //background color theme
		////////////////////////////////////////////////////////////////
		"editor.background": "#354631", //Secondary bac 354631
		"editorGroup.emptyBackground": "#354631", //Secondary bac
		"editorPane.background": "#354631", //Secondary bac
		"multiDiffEditor.border": "#354631", //Secondary bac
		"multiDiffEditor.headerBackground": "#354631", //Secondary bac
		"notebook.editorBackground": "#354631", //Secondary bac
		"chat.requestBackground": "#3546319e //Secondary bac",
		"editorGutter.background": "#354631", //Secondary bac
		"editorStickyScroll.background": "#354631", //Secondary bac
		"editorStickyScrollGutter.background": "#354631", //Secondary bac
		"minimap.chatEditHighlight": "#35463199 //Secondary bac",
		"multiDiffEditor.background": "#354631", //Secondary bac
		////////////////////////Documentar
		///////////////////////////////////////////////editor focus
		"editor.lineHighlightBackground": "#476245",
		"editorGroup.dropBackground": "#476245",
		"list.dropBackground": "#476245",
		"list.focusBackground": "#476245",
		"list.inactiveSelectionBackground": "#476245",
		"sideBar.dropBackground": "#476245",
		"editor.inactiveLineHighlightBackground": "#476245",
		"editorGutter.commentRangeForeground": "#476245",
		"editorGutter.itemBackground": "#476245",
		"editorOverviewRuler.commentDraftForeground": "#476245",
		"editorOverviewRuler.commentForeground": "#476245",
		"editorOverviewRuler.commentUnresolvedForeground": "#476245",
		"interactive.inactiveCodeBorder": "#476245",
		"notebook.selectedCellBackground": "#476245",
		"panelSection.dropBackground": "#476245",
		"terminal.dropBackground": "#476245",
		"terminalCommandGuide.foreground": "#476245",
		//////////////////////////////// iconos
		"activityBar.foreground": "#A4C79F",
		"activityBarTop.foreground": "#A4C79F",
		"debugConsole.infoForeground": "#A4C79F",
		"debugConsole.sourceForeground": "#A4C79F",
		"debugView.stateLabelForeground": "#A4C79F",
		"dropdown.foreground": "#A4C79F",
		"editorLineNumber.activeForeground": "#A4C79F",
		"editorWidget.foreground": "#A4C79F",
		"foreground": "#A4C79F",
		"gitlens.gutterForegroundColor": "#A4C79F",
		"icon.foreground": "#A4C79F",
		"list.deemphasizedForeground": "#A4C79F",
		"menu.foreground": "#A4C79F",
		"panelTitle.inactiveForeground": "#A4C79F",
		"peekViewResult.fileForeground": "#A4C79F",
		"peekViewTitleDescription.foreground": "#A4C79F",
		"sideBar.foreground": "#A4C79F",
		"sideBarTitle.foreground": "#A4C79F",
		"statusBar.debuggingForeground": "#A4C79F",
		"statusBar.foreground": "#A4C79F",
		"tab.inactiveForeground": "#A4C79F",
		"tab.unfocusedInactiveForeground": "#A4C79F",
		"terminal.ansiWhite": "#A4C79F",
		"terminal.foreground": "#A4C79F",
		"titleBar.activeForeground": "#A4C79F",
		"titleBar.inactiveForeground": "#A4C79F",
		"activityBar.activeBorder": "#A4C79F",
		"activityBar.dropBorder": "#A4C79F",
		"activityBarTop.activeBorder": "#A4C79F",
		"activityBarTop.dropBorder": "#A4C79F",
		"agentSessionReadIndicator.foreground": "#A4C79F26",
		"agentSessionSelectedUnfocusedBadge.border": "#A4C79F4d",
		"checkbox.foreground": "#A4C79F",
		"checkbox.selectBorder": "#A4C79F",
		"commandCenter.activeBorder": "#A4C79F4d",
		"commandCenter.border": "#A4C79F33",
		"commandCenter.foreground": "#A4C79F",
		"commandCenter.inactiveBorder": "#A4C79F40",
		"commandCenter.inactiveForeground": "#A4C79F",
		"debugView.exceptionLabelForeground": "#A4C79F",
		"diffEditor.unchangedRegionForeground": "#A4C79F",
		"editorActionList.foreground": "#A4C79F",
		"editorGroup.dropIntoPromptForeground": "#A4C79F",
		"editorGutter.foldingControlForeground": "#A4C79F",
		"editorHoverWidget.foreground": "#A4C79F",
		"gitlens.decorations.branchUnpublishedForegroundColor": "#A4C79F",
		"gitlens.decorations.branchUpToDateForegroundColor": "#A4C79F",
		"keybindingTable.headerBackground": "#A4C79F0a",
		"keybindingTable.rowsBackground": "#A4C79F0a",
		"list.dropBetweenBackground": "#A4C79F",
		"notebookStatusRunningIcon.foreground": "#A4C79F",
		"notifications.foreground": "#A4C79F",
		"quickInput.foreground": "#A4C79F",
		"search.resultsInfoForeground": "#A4C79Fa6",
		"settings.checkboxForeground": "#A4C79F",
		"settings.dropdownForeground": "#A4C79F",
		"statusBar.focusBorder": "#A4C79F",
		"statusBar.noFolderForeground": "#A4C79F",
		"statusBarItem.errorHoverForeground": "#A4C79F",
		"statusBarItem.focusBorder": "#A4C79F",
		"statusBarItem.hoverForeground": "#A4C79F",
		"statusBarItem.offlineHoverForeground": "#A4C79F",
		"statusBarItem.prominentForeground": "#A4C79F",
		"statusBarItem.prominentHoverForeground": "#A4C79F",
		"statusBarItem.remoteHoverForeground": "#A4C79F",
		"statusBarItem.warningHoverForeground": "#A4C79F",
		"symbolIcon.arrayForeground": "#A4C79F",
		"symbolIcon.booleanForeground": "#A4C79F",
		"symbolIcon.colorForeground": "#A4C79F",
		"symbolIcon.constantForeground": "#A4C79F",
		"symbolIcon.fileForeground": "#A4C79F",
		"symbolIcon.folderForeground": "#A4C79F",
		"symbolIcon.keyForeground": "#A4C79F",
		"symbolIcon.keywordForeground": "#A4C79F",
		"symbolIcon.moduleForeground": "#A4C79F",
		"symbolIcon.namespaceForeground": "#A4C79F",
		"symbolIcon.nullForeground": "#A4C79F",
		"symbolIcon.numberForeground": "#A4C79F",
		"symbolIcon.objectForeground": "#A4C79F",
		"symbolIcon.operatorForeground": "#A4C79F",
		"symbolIcon.packageForeground": "#A4C79F",
		"symbolIcon.propertyForeground": "#A4C79F",
		"symbolIcon.referenceForeground": "#A4C79F",
		"symbolIcon.snippetForeground": "#A4C79F",
		"symbolIcon.stringForeground": "#A4C79F",
		"symbolIcon.structForeground": "#A4C79F",
		"symbolIcon.textForeground": "#A4C79F",
		"symbolIcon.typeParameterForeground": "#A4C79F",
		"symbolIcon.unitForeground": "#A4C79F",
		"terminalSymbolIcon.branchForeground": "#A4C79F",
		"terminalSymbolIcon.commitForeground": "#A4C79F",
		"terminalSymbolIcon.fileForeground": "#A4C79F",
		"terminalSymbolIcon.folderForeground": "#A4C79F",
		"terminalSymbolIcon.pullRequestDoneForeground": "#A4C79F",
		"terminalSymbolIcon.pullRequestForeground": "#A4C79F",
		"terminalSymbolIcon.remoteForeground": "#A4C79F",
		"terminalSymbolIcon.stashForeground": "#A4C79F",
		"terminalSymbolIcon.symbolText": "#A4C79F",
		"terminalSymbolIcon.symbolicLinkFileForeground": "#A4C79F",
		"terminalSymbolIcon.symbolicLinkFolderForeground": "#A4C79F",
		"terminalSymbolIcon.tagForeground": "#",
		"tree.tableOddRowsBackground": "#A4C79F0a",
		//////////////////////////////////////////
		//////////////////////iconos 2
		"activityBar.inactiveForeground": "#A4C79F", //iconos
		"activityBarTop.inactiveForeground": "#A4C79F", //iconos
		"button.secondaryBackground": "#A4C79F", //iconos
		"extensionButton.background": "#A4C79F", //iconos
		"inlineEdit.gutterIndicator.secondaryBackground": "#A4C79F", //iconos
		"inlineEdit.gutterIndicator.secondaryBorder": "#A4C79F", //iconos
		/////////////
		//////tiny letters 
		"breadcrumb.foreground": "#A4C79F", //tiny letters
		"debugIcon.breakpointDisabledForeground": "#A4C79F", //tiny letters
		"descriptionForeground": "#A4C79F", //tiny letters
		"disabledForeground": "#A4C79F", //tiny letters
		"editorBracketMatch.border": "#A4C79F", //tiny letters
		"editorWidget.resizeBorder": "#A4C79F33", //tiny letters
		"focusBorder": "#A4C79F33", //tiny letters
		"gitDecoration.ignoredResourceForeground": "#A4C79F", //tiny letters
		"textSeparator.foreground": "#A4C79F", //tiny letters
		"commentsView.resolvedIcon": "#A4C79F", //tiny letters
		"commentsView.unresolvedIcon": "#A4C79F33", //tiny letters
		"editorCommentsWidget.rangeActiveBackground": "#A4C79F05", //tiny letters
		"editorCommentsWidget.rangeBackground": "#A4C79F05", //tiny letters
		"editorCommentsWidget.resolvedBorder": "#A4C79F", //tiny letters
		"editorCommentsWidget.unresolvedBorder": "#A4C79F33", //tiny letters
		"gitlens.decorations.ignoredForegroundColor": "#A4C79F", //tiny letters
		"inlineChatInput.focusBorder": "#A4C79F33", //tiny letters
		"list.focusOutline": "#A4C79F33", //tiny letters
		"notebook.cellInsertionIndicator": "#A4C79F33", //tiny letters
		"notebook.focusedEditorBorder": "#A4C79F33", //tiny letters
		"settings.focusedRowBorder": "#A4C79F33", //tiny letters
		//////
		/////editor numbers
		"editorLineNumber.foreground": "#886FA1", //editor numbers
		"tab.unfocusedActiveBorder": "#886FA1", //editor numbers
	},
	"editor.tokenColorCustomizations": {
		"textMateRules": [
			{
				"scope": [
					"comment",
					"comment.block.documentation",
					"punctuation.definition.comment",
					"comment.block.documentation punctuation",
					"string.quoted.docstring.multi",
					"string.quoted.docstring.multi.python punctuation.definition.string.begin",
					"string.quoted.docstring.multi.python punctuation.definition.string.end",
					"string.quoted.docstring.multi.python constant.character.escape"
				],
				"settings": {
					"foreground": "#886FA1",
				}
			}
		],
	},
}
```