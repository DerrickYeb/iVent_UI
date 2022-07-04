import React, {useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    Button
} from "@material-ui/core";
import {Drawer} from '@mantine/core';
import {Close} from "@material-ui/icons";

export default function ModalUtils({
                                       children,
                                       onClose,
                                       onOpen,
                                       open,
                                       okBtn,
                                       closeBtn,
                                       title,
                                       subtitle,
                                       size = "sm",
                                       oKBtnTitle = "Finish",
                                       closeBtnTitle = "Close",
                                       hideBackdrop = true,
                                       isWorking = false,
                                       showOkBtn = true,
                                       keepMounted = false,
                                       ...restProps
                                   }) {
    return (
        <Dialog
            //PaperComponent={PaperComponent}
            maxWidth={size}
            keepMounted={keepMounted}
            //disableBackdropClick
            disableEscapeKeyDown
            fullWidth
            hideBackdrop={hideBackdrop}
            open={open}
            onClose={onClose}
            {...restProps}
        >
            <DialogTitle id="draggable-dialog-title">
                <Grid container justify="space-between" alignItems="center">
                    <Grid item xs={false}>
                        {title}
                    </Grid>
                    <Grid item xs={false}>
                        <IconButton onClick={closeBtn}>
                            <Close/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <span variant="body2">{subtitle}</span>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button disableElevation onClick={closeBtn}>{closeBtnTitle}</Button>
                {showOkBtn ? (
                    <Button
                        variant="contained"
                        color={restProps?.color || "secondary"}
                        onClick={okBtn}
                        disabled={isWorking}
                        disableElevation
                    >
                        {oKBtnTitle}
                    </Button>
                ) : null}
            </DialogActions>
        </Dialog>
    );
}

export function BasicModalUtils({
                                    children,
                                    onClose,
                                    open,
                                    okBtn,
                                    closeBtn,
                                    title,
                                    subtitle,
                                    size = "sm",
                                    hideBackdrop = false,
                                    keepMounted = false,
    zIndex = 100,
                                    ...restProps
                                }) {
    return (
        <Dialog
            maxWidth={size}
            keepMounted={keepMounted}
            // disableBackdropClick
            disableEscapeKeyDown
            fullWidth
            hideBackdrop={hideBackdrop}
            open={open}
            onClose={onClose}
            {...restProps}
            style={{zIndex: zIndex}}
        >
            <DialogTitle>
                <div className="flex items-center space-x-2 justify-between">
                    <div className="flex space-x-2">
                        {title}
                    </div>
                    <IconButton onClick={onClose}>
                        <Close/>
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {closeBtn}
                {okBtn}
            </DialogActions>
        </Dialog>
    );
}


export function BasicRightDrawerUtils({
                                          children,
                                          onClose,
                                          open,
                                          okBtn,
                                          closeBtn,
                                          title,
                                          subtitle,
                                          hideBackdrop = false,
                                          keepMounted = false,
                                          size = 400,
                                          ...restProps
                                      }) {
    return <Drawer onClose={onClose} opened={open} position="right" size={size}
                   hideCloseButton
                   noCloseOnClickOutside
                   noFocusTrap
                   //noScrollLock
                   //noOverlay
                   overlayColor="black"
                   overlayOpacity={0.3}
                   shadow={"xl"}
                   transition="rotate-left"
                   transitionDuration={250}
                   transitionTimingFunction="ease"
                   withCloseButton={false}
        //title={title}
    >
        <div className="bg-gray-50">
            {children}
        </div>
    </Drawer>
}
