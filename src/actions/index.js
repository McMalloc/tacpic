import {USER} from './constants'

export const switchCursorMode = mode => ({
    type: 'SWITCH_CURSOR_MODE',
    mode
});

export const createTextureModeAction = mode => ({
    type: 'SWITCH_TEXTURE_MODE',
    mode
});

export const createFillModeAction = colour => ({
    type: 'SWITCH_FILL_MODE',
    colour
});

export const canvasUpdated = (serializedCanvas) => ({
    type: 'CANVAS_UPDATED',
    serializedCanvas
});

export const canvasResized = (width, height) => ({
    type: "CANVAS_RESIZED",
    width,
    height
});

export const layoutChanged = layout => ({
    // type: USER.SAVE_LAYOUT.REQUEST, // das Ändern des Layouts alleine sollte noch nichts zum Server persistieren
    type: "LAYOUT_CHANGED",
    layout
});

export const widgetVisibilityToggled = (id, value) => ({
    type: "WIDGET_VISIBILITY_TOGGLED",
    id,
    value
});

