function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Copyright (C) 2012 Stéphane Démurget <stephane.demurget@free.fr>
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// Author: Stéphane Démurget <stephane.demurget@free.fr>
const Lang = imports.lang;
const Gettext = imports.gettext.domain('drop-down-terminal-x');
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const _ = Gettext.gettext;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience; // setting keys

const ENABLE_ANIMATION_SETTING_KEY = 'enable-animation';
const OPENING_ANIMATION_TIME_SETTING_KEY = 'opening-animation-time';
const CLOSING_ANIMATION_TIME_SETTING_KEY = 'closing-animation-time';
const TRANSPARENT_TERMINAL_SETTING_KEY = 'transparent-terminal';
const SCROLLBAR_VISIBLE_SETTING_KEY = 'scrollbar-visible';
const TERMINAL_SIZE_SETTING_KEY = 'terminal-size';
const TERMINAL_LEFT_PADDING_SETTING_KEY = 'terminal-left-padding';
const TERMINAL_RIGHT_PADDING_SETTING_KEY = 'terminal-right-padding';
const TERMINAL_TOP_PADDING_SETTING_KEY = 'terminal-top-padding';
const TERMINAL_BOTTOM_PADDING_SETTING_KEY = 'terminal-bottom-padding';
const TERMINAL_POSITION_SETTING_KEY = 'terminal-position';
const TERMINAL_CURSOR_SETTING_KEY = 'terminal-cursor';
const TRANSPARENCY_LEVEL_SETTING_KEY = 'transparency-level';
const SHORTCUT_TYPE_SETTING_KEY = 'shortcut-type';
const OTHER_SHORTCUT_SETTING_KEY = 'other-shortcut';
const REAL_SHORTCUT_SETTING_KEY = 'real-shortcut';
const ENABLE_TOGGLE_ON_SCROLL_SETTING_KEY = 'enable-toggle-on-scroll';
const FOREGROUND_COLOR_SETTING_KEY = 'foreground-color';
const BACKGROUND_COLOR_SETTING_KEY = 'background-color';
const RUN_CUSTOM_COMMAND_SETTING_KEY = 'run-custom-command';
const CUSTOM_COMMAND_SETTING_KEY = 'custom-command';
const ENABLE_AUDIBLE_BELL_KEY = 'enable-audible-bell';
const ENABLE_TABS_SETTING_KEY = 'enable-tabs'; // shortcut tree view columns

const SHORTCUT_COLUMN_KEY = 0;
const SHORTCUT_COLUMN_MODS = 1; // settings widget

const DropDownTerminalSettingsWidget = new GObject.Class({
  Name: 'DropDownTerminal.Prefs.DropDownTerminalSettingsWidget',
  GTypeName: 'DropDownTerminalSettingsWidget',
  Extends: Gtk.Box,
  _init: function (params) {
    this.parent(params);
    this.orientation = Gtk.Orientation.VERTICAL;
    this.spacign = 0; // creates the settings

    this._settings = Convenience.getSettings(Me.path, Me.metadata.id); // creates the ui builder and add the main resource file

    let uiFilePath = Me.path + '/prefs.gtkbuilder';
    let builder = new Gtk.Builder();

    if (builder.add_from_file(uiFilePath) == 0) {
      log('could not load the ui file: %s'.format(uiFilePath));
      let label = new Gtk.Label({
        label: _('Could not load the preferences UI file'),
        vexpand: true
      });
      this.pack_start(label, true, true, 0);
    } else {
      // gets the interesting builder objects
      let mainNotebook = builder.get_object('main-notebook');
      let enableAnimationCheckButton = builder.get_object('enable-animation-checkbutton');
      let openingAnimationTimeSpinButton = builder.get_object('opening-animation-time-spinbutton');
      let closingAnimationTimeSpinButton = builder.get_object('closing-animation-time-spinbutton');
      let transparentTerminalCheckButton = builder.get_object('transparent-terminal-checkbutton');
      let scrollbarVisibleCheckButton = builder.get_object('scrollbar-visible-checkbutton');
      let terminalSizeEntry = builder.get_object('terminal-size-entry');
      let terminalSizeResetButton = builder.get_object('terminal-size-reset-button');
      let terminalLeftPaddingEntry = builder.get_object('terminal-left-padding-entry');
      let terminalLeftPaddingResetButton = builder.get_object('terminal-left-padding-reset-button');
      let terminalRightPaddingEntry = builder.get_object('terminal-right-padding-entry');
      let terminalRightPaddingResetButton = builder.get_object('terminal-right-padding-reset-button');
      let terminalTopPaddingEntry = builder.get_object('terminal-top-padding-entry');
      let terminalTopPaddingResetButton = builder.get_object('terminal-top-padding-reset-button');
      let terminalBottomPaddingEntry = builder.get_object('terminal-bottom-padding-entry');
      let terminalBottomPaddingResetButton = builder.get_object('terminal-bottom-padding-reset-button');
      let transparencyLevelSpinButton = builder.get_object('transparency-level-spinbutton');
      let defaultShortcutRadioButton = builder.get_object('default-shortcut-radiobutton');
      let enableToggleOnScrollCheckButton = builder.get_object('enable-toggle-on-scroll-checkbutton');
      let foregroundColorResetButton = builder.get_object('foreground-color-reset-button');
      let backgroundColorResetButton = builder.get_object('background-color-reset-button');
      let positionComboBox = builder.get_object('position-combobox');
      let cursorComboBox = builder.get_object('cursor-combobox');
      let enableAudibleBellCheckButton = builder.get_object('enable-audible-bell-checkbutton');
      let enableTabsCheckButton = builder.get_object('enable-tabs-checkbutton');
      this._foregroundColorButton = builder.get_object('foreground-color-button');
      this._backgroundColorButton = builder.get_object('background-color-button');
      this._otherShortcutRadioButton = builder.get_object('other-shortcut-radiobutton');
      this._otherShortcutTreeView = builder.get_object('other-shortcut-treeview');
      this._otherShortcutListStore = builder.get_object('other-shortcut-liststore');
      this._runCustomCommandCheckButton = builder.get_object('run-custom-command-checkbutton');
      this._customCommandBox = builder.get_object('custom-command-box');
      this._customCommandEntry = builder.get_object('custom-command-entry'); // packs the main box

      this.pack_start(mainNotebook, true, true, 0); // gives a hint on invalid window height input (does not prevent from writing a wrong value)

      terminalSizeEntry.connect('changed', Lang.bind(this, function () {
        let match = terminalSizeEntry.get_text().trim().match(/^([1-9]\d*)\s*(px|%)$/i);
        let valid = match !== null;

        if (valid) {
          let value = parseInt(match[1]);
          let type = match[2];
          valid = type.toLowerCase() == 'px' ? value > 0 : value > 0 && value <= 100;
        }

        terminalSizeEntry['secondary-icon-name'] = valid ? null : 'dialog-warning-symbolic';
        terminalSizeEntry['secondary-icon-tooltip-text'] = valid ? null : _('Invalid syntax or range');
      })); // gives a hint on invalid window height input (does not prevent from writing a wrong value)

      terminalLeftPaddingEntry.connect('changed', Lang.bind(this, function () {
        let match = terminalLeftPaddingEntry.get_text().trim().match(/^(\d*)\s*(px|%)$/i);
        let valid = match !== null;

        if (valid) {
          let value = parseInt(match[1]);
          let type = match[2];
          valid = type.toLowerCase() == 'px' ? value >= 0 : value >= 0 && value < 100;
        }

        terminalLeftPaddingEntry['secondary-icon-name'] = valid ? null : 'dialog-warning-symbolic';
        terminalLeftPaddingEntry['secondary-icon-tooltip-text'] = valid ? null : _('Invalid syntax or range');
      })); // gives a hint on invalid window height input (does not prevent from writing a wrong value)

      terminalRightPaddingEntry.connect('changed', Lang.bind(this, function () {
        let match = terminalRightPaddingEntry.get_text().trim().match(/^(\d*)\s*(px|%)$/i);
        let valid = match !== null;

        if (valid) {
          let value = parseInt(match[1]);
          let type = match[2];
          valid = type.toLowerCase() == 'px' ? value >= 0 : value >= 0 && value < 100;
        }

        terminalRightPaddingEntry['secondary-icon-name'] = valid ? null : 'dialog-warning-symbolic';
        terminalRightPaddingEntry['secondary-icon-tooltip-text'] = valid ? null : _('Invalid syntax or range');
      })); // gives a hint on invalid window height input (does not prevent from writing a wrong value)

      terminalTopPaddingEntry.connect('changed', Lang.bind(this, function () {
        let match = terminalTopPaddingEntry.get_text().trim().match(/^(\d*)\s*(px|%)$/i);
        let valid = match !== null;

        if (valid) {
          let value = parseInt(match[1]);
          let type = match[2];
          valid = type.toLowerCase() == 'px' ? value >= 0 : value >= 0 && value < 100;
        }

        terminalTopPaddingEntry['secondary-icon-name'] = valid ? null : 'dialog-warning-symbolic';
        terminalTopPaddingEntry['secondary-icon-tooltip-text'] = valid ? null : _('Invalid syntax or range');
      })); // gives a hint on invalid window height input (does not prevent from writing a wrong value)

      terminalBottomPaddingEntry.connect('changed', Lang.bind(this, function () {
        let match = terminalBottomPaddingEntry.get_text().trim().match(/^(\d*)\s*(px|%)$/i);
        let valid = match !== null;

        if (valid) {
          let value = parseInt(match[1]);
          let type = match[2];
          valid = type.toLowerCase() == 'px' ? value >= 0 : value >= 0 && value < 100;
        }

        terminalBottomPaddingEntry['secondary-icon-name'] = valid ? null : 'dialog-warning-symbolic';
        terminalBottomPaddingEntry['secondary-icon-tooltip-text'] = valid ? null : _('Invalid syntax or range');
      })); // configure the tree view column and creates the unique row of the model

      this._configureOtherShortcutTreeView(this._otherShortcutTreeView);

      this._otherShortcutRowIter = this._otherShortcutListStore.append(); // binds the animation enablement setting

      this._settings.bind(ENABLE_ANIMATION_SETTING_KEY, enableAnimationCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT); // binds the animation time settings


      openingAnimationTimeSpinButton.connect('value-changed', Lang.bind(this, function (button) {
        this._settings.set_uint(OPENING_ANIMATION_TIME_SETTING_KEY, button.get_value_as_int());
      }));
      openingAnimationTimeSpinButton.set_value(this._settings.get_uint(OPENING_ANIMATION_TIME_SETTING_KEY));
      closingAnimationTimeSpinButton.connect('value-changed', Lang.bind(this, function (button) {
        this._settings.set_uint(CLOSING_ANIMATION_TIME_SETTING_KEY, button.get_value_as_int());
      }));
      closingAnimationTimeSpinButton.set_value(this._settings.get_uint(CLOSING_ANIMATION_TIME_SETTING_KEY)); // binds the terminal transparency setting

      this._settings.bind(TRANSPARENT_TERMINAL_SETTING_KEY, transparentTerminalCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT); // binds the scrollbar visibility setting


      this._settings.bind(SCROLLBAR_VISIBLE_SETTING_KEY, scrollbarVisibleCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT); // binds the tabs state setting


      this._settings.bind(ENABLE_TABS_SETTING_KEY, enableTabsCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT); // binds the terminal height setting


      this._settings.bind(TERMINAL_SIZE_SETTING_KEY, terminalSizeEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      terminalSizeResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(TERMINAL_SIZE_SETTING_KEY);
      })); // binds the terminal padding setting

      this._settings.bind(TERMINAL_LEFT_PADDING_SETTING_KEY, terminalLeftPaddingEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      terminalLeftPaddingResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(TERMINAL_LEFT_PADDING_SETTING_KEY);
      })); // binds the terminal padding setting

      this._settings.bind(TERMINAL_RIGHT_PADDING_SETTING_KEY, terminalRightPaddingEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      terminalRightPaddingResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(TERMINAL_RIGHT_PADDING_SETTING_KEY);
      })); // binds the terminal padding setting

      this._settings.bind(TERMINAL_TOP_PADDING_SETTING_KEY, terminalTopPaddingEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      terminalTopPaddingResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(TERMINAL_TOP_PADDING_SETTING_KEY);
      })); // binds the terminal padding setting

      this._settings.bind(TERMINAL_BOTTOM_PADDING_SETTING_KEY, terminalBottomPaddingEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      terminalBottomPaddingResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(TERMINAL_BOTTOM_PADDING_SETTING_KEY);
      })); // binds the custom shortcut setting

      this._settings.connect('changed::' + OTHER_SHORTCUT_SETTING_KEY, Lang.bind(this, this._otherShortcutSettingChanged));

      this._otherShortcutSettingChanged(); // binds the shortcut type (too bad bind_with_mapping is not introspectable)


      this._settings.connect('changed::' + SHORTCUT_TYPE_SETTING_KEY, Lang.bind(this, this._shortcutTypeSettingChanged));

      this._shortcutTypeSettingChanged();

      this._otherShortcutRadioButton.connect('notify::active', Lang.bind(this, function () {
        this._settings.set_string(SHORTCUT_TYPE_SETTING_KEY, this._otherShortcutRadioButton['active'] ? 'other' : 'default');

        this._shortcutTypeSettingChanged();
      })); // binds the toggle on scroll setting


      this._settings.bind(ENABLE_TOGGLE_ON_SCROLL_SETTING_KEY, enableToggleOnScrollCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT); // binds the custom command settings


      this._settings.bind(RUN_CUSTOM_COMMAND_SETTING_KEY, this._runCustomCommandCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT);

      this._settings.bind(CUSTOM_COMMAND_SETTING_KEY, this._customCommandEntry, 'text', Gio.SettingsBindFlags.DEFAULT);

      this._runCustomCommandCheckButton.connect('notify::active', Lang.bind(this, this._runCustomCommandCheckButtonToggled));

      this._customCommandEntry.connect('changed', Lang.bind(this, this._checkCustomCommandEntry));

      this._runCustomCommandCheckButtonToggled();

      this._checkCustomCommandEntry(); // binds the terminal bett setting


      this._settings.bind(ENABLE_AUDIBLE_BELL_KEY, enableAudibleBellCheckButton, 'active', Gio.SettingsBindFlags.DEFAULT); // binds the color settings


      this._foregroundColorButton.connect('color-set', Lang.bind(this, function () {
        this._settings.set_string(FOREGROUND_COLOR_SETTING_KEY, this._foregroundColorButton.rgba.to_string());

        this._updateForegroundColorButton();
      }));

      this._backgroundColorButton.connect('color-set', Lang.bind(this, function () {
        this._settings.set_string(BACKGROUND_COLOR_SETTING_KEY, this._backgroundColorButton.rgba.to_string());

        this._updateBackgroundColorButton();
      }));

      foregroundColorResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(FOREGROUND_COLOR_SETTING_KEY);

        this._updateForegroundColorButton();
      }));
      backgroundColorResetButton.connect('clicked', Lang.bind(this, function () {
        this._settings.reset(BACKGROUND_COLOR_SETTING_KEY);

        this._updateBackgroundColorButton();
      }));

      this._updateForegroundColorButton();

      this._updateBackgroundColorButton(); // binds the transparency level


      transparencyLevelSpinButton.connect('value-changed', Lang.bind(this, function (button) {
        this._settings.set_uint(TRANSPARENCY_LEVEL_SETTING_KEY, button.get_value_as_int());
      }));
      transparencyLevelSpinButton.set_value(this._settings.get_uint(TRANSPARENCY_LEVEL_SETTING_KEY)); // binds the terminal position setting
      // this._settings.bind(TERMINAL_POSITION_SETTING_KEY, positionComboBox, "active", Gio.SettingsBindFlags.DEFAULT);

      positionComboBox.set_active(this._settings.get_enum(TERMINAL_POSITION_SETTING_KEY));
      positionComboBox.connect('changed', Lang.bind(this, function (widget) {
        this._settings.set_enum(TERMINAL_POSITION_SETTING_KEY, widget.get_active());
      })); // binds the terminal cursor type setting

      cursorComboBox.set_active(this._settings.get_enum(TERMINAL_CURSOR_SETTING_KEY));
      cursorComboBox.connect('changed', Lang.bind(this, function (widget) {
        this._settings.set_enum(TERMINAL_CURSOR_SETTING_KEY, widget.get_active());
      }));
    }
  },
  _configureOtherShortcutTreeView: function (treeView) {
    let renderer = new Gtk.CellRendererAccel({
      editable: true
    });
    renderer.connect('accel-edited', Lang.bind(this, this._otherShortcutAccelEdited));
    renderer.connect('accel-cleared', Lang.bind(this, this._otherShortcutAccelCleared));
    let column = new Gtk.TreeViewColumn();
    column.pack_start(renderer, true);
    column.add_attribute(renderer, 'accel-key', SHORTCUT_COLUMN_KEY);
    column.add_attribute(renderer, 'accel-mods', 1);
    treeView.append_column(column);
  },
  _shortcutTypeSettingChanged: function () {
    let otherShortcutType = this._settings.get_string(SHORTCUT_TYPE_SETTING_KEY) == 'other';

    if (this._otherShortcutRadioButton['active'] != otherShortcutType) {
      // guards against endless notification cycle
      this._otherShortcutRadioButton['active'] = otherShortcutType;
    }

    this._otherShortcutTreeView.set_sensitive(otherShortcutType);

    this._updateRealShortcut();
  },
  _otherShortcutSettingChanged: function () {
    this._updateOtherShortcutRow(this._settings.get_strv(OTHER_SHORTCUT_SETTING_KEY)[0]);

    this._updateRealShortcut();
  },
  _otherShortcutAccelEdited: function (renderer, path, key, mods, hwCode) {
    let accel = Gtk.accelerator_name(key, mods);

    this._updateOtherShortcutRow(accel);

    this._settings.set_strv(OTHER_SHORTCUT_SETTING_KEY, [accel]);
  },
  _otherShortcutAccelCleared: function (renderer, path) {
    this._updateOtherShortcutRow(null);

    this._settings.set_strv(OTHER_SHORTCUT_SETTING_KEY, []);
  },
  _updateRealShortcut: function () {
    let shortcutType = this._settings.get_string(SHORTCUT_TYPE_SETTING_KEY);

    if (shortcutType == 'default') {
      this._settings.reset(REAL_SHORTCUT_SETTING_KEY); // the default of this key is the default shortcut

    } else {
      this._settings.set_strv(REAL_SHORTCUT_SETTING_KEY, this._settings.get_strv(OTHER_SHORTCUT_SETTING_KEY));
    }
  },
  _updateOtherShortcutRow: function (accel) {
    let _ref = accel !== null ? Gtk.accelerator_parse(accel) : [0, 0],
        _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        mods = _ref2[1];

    this._otherShortcutListStore.set(this._otherShortcutRowIter, [SHORTCUT_COLUMN_KEY, SHORTCUT_COLUMN_MODS], [key, mods]);
  },
  _updateForegroundColorButton: function () {
    this._foregroundColorButton.set_rgba(Convenience.parseRgbaColor(this._settings.get_string(FOREGROUND_COLOR_SETTING_KEY)));
  },
  _updateBackgroundColorButton: function () {
    this._backgroundColorButton.set_rgba(Convenience.parseRgbaColor(this._settings.get_string(BACKGROUND_COLOR_SETTING_KEY)));
  },
  _runCustomCommandCheckButtonToggled: function () {
    this._customCommandBox.set_sensitive(this._runCustomCommandCheckButton.get_active());

    this._checkCustomCommandEntry();
  },
  _checkCustomCommandEntry: function () {
    let runCustomCommand = this._runCustomCommandCheckButton.get_active();

    let error = null;

    if (runCustomCommand) {
      let customCommand = this._customCommandEntry.get_text().trim();

      try {
        let _GLib$shell_parse_arg = GLib.shell_parse_argv(customCommand),
            _GLib$shell_parse_arg2 = _slicedToArray(_GLib$shell_parse_arg, 2),
            parsed = _GLib$shell_parse_arg2[0],
            args = _GLib$shell_parse_arg2[1];

        if (!parsed) {
          error = _('no argument found');
        }
      } catch (e) {
        error = e.message;
      }
    }

    this._customCommandEntry['secondary-icon-name'] = error ? 'dialog-warning-symbolic' : null;
    this._customCommandEntry['secondary-icon-tooltip-text'] = error ? _('Error parsing command: %s').format(error) : null;
  }
}); // preferences init hook

function init() {} // preferences widget building hook


function buildPrefsWidget() {
  let widget = new DropDownTerminalSettingsWidget();
  widget.show_all();
  return widget;
}

