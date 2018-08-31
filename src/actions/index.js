export const switchCursorMode = mode => ({
    type: 'SWITCH_CURSOR_MODE',
    mode
});

export const createTextureModeAction = mode => ({
    type: 'SWITCH_TEXTURE_MODE',
    mode
});

export const canvasUpdated = serializedCanvas => ({
    type: "CANVAS_UPDATED",
    serializedCanvas
});

export const canvasResized = (width, height) => ({
    type: "CANVAS_RESIZED",
    width,
    height
});

