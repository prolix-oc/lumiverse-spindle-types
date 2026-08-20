/** Extension lifecycle events emitted by the Spindle system */
export var SpindleEvent;
(function (SpindleEvent) {
    SpindleEvent["EXTENSION_LOADED"] = "EXTENSION_LOADED";
    SpindleEvent["EXTENSION_UNLOADED"] = "EXTENSION_UNLOADED";
    SpindleEvent["EXTENSION_ERROR"] = "EXTENSION_ERROR";
    SpindleEvent["PERMISSION_CHANGED"] = "PERMISSION_CHANGED";
})(SpindleEvent || (SpindleEvent = {}));
/**
 * Core Lumiverse event types that extensions can subscribe to.
 * Mirrors the backend EventType enum.
 */
export var CoreEventType;
(function (CoreEventType) {
    CoreEventType["CONNECTED"] = "CONNECTED";
    CoreEventType["CHAT_CHANGED"] = "CHAT_CHANGED";
    CoreEventType["CHAT_SWITCHED"] = "CHAT_SWITCHED";
    CoreEventType["CHAT_FORKED"] = "CHAT_FORKED";
    CoreEventType["MESSAGE_SENT"] = "MESSAGE_SENT";
    CoreEventType["MESSAGE_EDITED"] = "MESSAGE_EDITED";
    CoreEventType["MESSAGE_DELETED"] = "MESSAGE_DELETED";
    CoreEventType["MESSAGE_SWIPED"] = "MESSAGE_SWIPED";
    CoreEventType["SWIPE_EDITED"] = "SWIPE_EDITED";
    CoreEventType["CHARACTER_MESSAGE_RENDERED"] = "CHARACTER_MESSAGE_RENDERED";
    CoreEventType["USER_MESSAGE_RENDERED"] = "USER_MESSAGE_RENDERED";
    CoreEventType["GENERATION_STARTED"] = "GENERATION_STARTED";
    CoreEventType["GENERATION_ENDED"] = "GENERATION_ENDED";
    CoreEventType["GENERATION_STOPPED"] = "GENERATION_STOPPED";
    CoreEventType["STREAM_TOKEN_RECEIVED"] = "STREAM_TOKEN_RECEIVED";
    CoreEventType["CHARACTER_EDITED"] = "CHARACTER_EDITED";
    CoreEventType["CHARACTER_DELETED"] = "CHARACTER_DELETED";
    CoreEventType["CHARACTER_DUPLICATED"] = "CHARACTER_DUPLICATED";
    CoreEventType["PERSONA_CHANGED"] = "PERSONA_CHANGED";
    CoreEventType["IMAGE_UPLOADED"] = "IMAGE_UPLOADED";
    CoreEventType["IMAGE_DELETED"] = "IMAGE_DELETED";
    CoreEventType["SETTINGS_UPDATED"] = "SETTINGS_UPDATED";
    CoreEventType["PRESET_CHANGED"] = "PRESET_CHANGED";
    CoreEventType["CONNECTION_PROFILE_LOADED"] = "CONNECTION_PROFILE_LOADED";
    CoreEventType["MAIN_API_CHANGED"] = "MAIN_API_CHANGED";
    CoreEventType["WORLD_INFO_ACTIVATED"] = "WORLD_INFO_ACTIVATED";
    CoreEventType["REGEX_SCRIPT_CHANGED"] = "REGEX_SCRIPT_CHANGED";
    CoreEventType["REGEX_SCRIPT_DELETED"] = "REGEX_SCRIPT_DELETED";
    CoreEventType["WORLD_BOOK_CHANGED"] = "WORLD_BOOK_CHANGED";
    CoreEventType["WORLD_BOOK_DELETED"] = "WORLD_BOOK_DELETED";
    CoreEventType["WORLD_BOOK_ENTRY_CHANGED"] = "WORLD_BOOK_ENTRY_CHANGED";
    CoreEventType["WORLD_BOOK_ENTRY_DELETED"] = "WORLD_BOOK_ENTRY_DELETED";
    CoreEventType["MESSAGE_TAG_INTERCEPTED"] = "MESSAGE_TAG_INTERCEPTED";
    CoreEventType["TOOL_INVOCATION"] = "TOOL_INVOCATION";
    CoreEventType["PROVIDER_CHANGED"] = "PROVIDER_CHANGED";
})(CoreEventType || (CoreEventType = {}));
