//
// Copyright (c) 2014-2015, THUNDERBEAST GAMES LLC All rights reserved
// LICENSE: Atomic Game Engine Editor and Tools EULA
// Please see LICENSE_ATOMIC_EDITOR_AND_TOOLS.md in repository root for
// license information: https://github.com/AtomicGameEngine/AtomicGameEngine
//

import strings = require("ui/EditorStrings");
import EditorEvents = require("editor/EditorEvents");
import EditorUI = require("ui/EditorUI");
import MenuItemSources = require("./MenuItemSources");

class MainFrameMenu extends Atomic.ScriptObject {

    constructor() {

        super();

        MenuItemSources.createMenuItemSource("menu atomic editor", editorItems);
        MenuItemSources.createMenuItemSource("menu edit", editItems);
        MenuItemSources.createMenuItemSource("menu file", fileItems);
        MenuItemSources.createMenuItemSource("menu build", buildItems);
        MenuItemSources.createMenuItemSource("menu tools", toolsItems);
        MenuItemSources.createMenuItemSource("menu developer", developerItems);
        MenuItemSources.createMenuItemSource("menu help", helpItems);
    }

    handlePopupMenu(target: Atomic.UIWidget, refid: string): boolean {

        if (target.id == "menu atomic editor popup") {

            if (refid == "about atomic editor") {

                EditorUI.getModelOps().showAbout();

                return true;
            }

            if (refid == "manage license") {

                EditorUI.getModelOps().showManageLicense();

                return true;

            }

            if (refid == "quit") {

                Atomic.ui.requestExit();
                return true;

            }

        } else if (target.id == "menu edit popup") {

            if (refid == "edit play") {
                EditorUI.getShortcuts().invokePlay();
                return true;
            }

            if (refid == "edit format code") {
                EditorUI.getShortcuts().invokeFormatCode();
                return true;
            }

            return false;

        } else if (target.id == "menu file popup") {

            if (refid == "file new project") {

                if (ToolCore.toolSystem.project) {

                    EditorUI.showModalError("Project Open",
                        "Please close the current project before creating a new one");

                    return true;
                }

                var mo = EditorUI.getModelOps();
                mo.showNewProject();

                return true;

            }
            if (refid == "file open project") {

                if (ToolCore.toolSystem.project) {

                    EditorUI.showModalError("Project Open",
                        "Please close the current project before opening new one");

                    return true;
                }

                var utils = new Editor.FileUtils();
                var path = utils.openProjectFileDialog();
                if (path) {

                    this.sendEvent(EditorEvents.LoadProject, { path: path });

                }


                return true;

            }

            if (refid == "file close project") {

                this.sendEvent(EditorEvents.CloseProject);

                return true;

            }

            if (refid == "file save file") {
                EditorUI.getShortcuts().invokeFileSave();
                return true;
            }

            if (refid == "file close file") {
                EditorUI.getShortcuts().invokeFileClose();
                return true;
            }

            if (refid == "file save all") {
                this.sendEvent(EditorEvents.SaveAllResources);
                return true;
            }

            return false;

        } else if (target.id == "menu developer popup") {

            if (refid == "developer show console") {
                Atomic.ui.showConsole(true);
                return true;
            }

        } else if (target.id == "menu tools popup") {

            if (refid == "tools toggle profiler") {
                Atomic.ui.toggleDebugHud();
                return true;
            }

        } else if (target.id == "menu build popup") {

            if (refid == "build build") {

                EditorUI.getModelOps().showBuild();

                return true;

            } else if (refid == "build settings") {

                EditorUI.getModelOps().showBuildSettings();
                return true;

            }

        } else if (target.id == "menu help popup") {

            if (refid == "help forums") {
                Atomic.fileSystem.systemOpen("http://atomicgameengine.com/forum/")
                return true;
            } else if (refid == "help chat") {
                Atomic.fileSystem.systemOpen("https://gitter.im/AtomicGameEngine/AtomicGameEngine/")
                return true;
            } else if (refid == "help github") {
                Atomic.fileSystem.systemOpen("https://github.com/AtomicGameEngine/AtomicGameEngine/")
                return true;
            } else if (refid == "help api") {
                var url = "file://" + ToolCore.toolEnvironment.toolDataDir + "Docs/JSDocs/Atomic.html";
                Atomic.fileSystem.systemOpen(url);
                return true;
            }

        }

    }

}

export = MainFrameMenu;

// initialization
var StringID = strings.StringID;

var editorItems = {
    "About Atomic Editor": "about atomic editor",
    "-1": null,
    "Manage License": "manage license",
    "-2": null,
    "Check for Updates": "check update",
    "-3": null,
    "Quit": "quit"
};

var editItems = {

    "Undo": ["edit undo", StringID.ShortcutUndo],
    "Redo": ["edit redo", StringID.ShortcutRedo],
    "-1": null,
    "Cut": ["edit cut", StringID.ShortcutCut],
    "Copy": ["edit copy", StringID.ShortcutCopy],
    "Paste": ["edit paste", StringID.ShortcutPaste],
    "Select All": ["edit select all", StringID.ShortcutSelectAll],
    "-2": null,
    "Find": ["edit find", StringID.ShortcutFind],
    "Find Next": ["edit find next", StringID.ShortcutFindNext],
    "Find Prev": ["edit find prev", StringID.ShortcutFindPrev],
    "-3": null,
    "Format Code": ["edit format code", StringID.ShortcutBeautify],
    "-4": null,
    "Play": ["edit play", StringID.ShortcutPlay]

};

var toolsItems = {

    "Toggle Profiler": ["tools toggle profiler"]

}

var buildItems = {

    "Build": ["build build", StringID.ShortcutBuild],
    "Build Settings": ["build settings", StringID.ShortcutBuildSettings]
}


var developerItems = {

    "Show Console": ["developer show console"]

}

var fileItems = {

    "New Project": ["file new project"],
    "Open Project": ["file open project"],
    "Save Project": ["file save project"],
    "-1": null,
    "Close Project": ["file close project"],
    "-2": null,
    "Save File": ["file save file", StringID.ShortcutSaveFile],
    "Save All Files": ["file save all"],
    "Close File": ["file close file", StringID.ShortcutCloseFile]
}

var helpItems = {

    "API Documentation": ["help api"],
    "-1": null,
    "Atomic Chat": ["help chat"],
    "Atomic Forums": ["help forums"],
    "-2": null,
    "Atomic Game Engine on GitHub": ["help github"]
}