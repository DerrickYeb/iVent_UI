import { useSnackbar } from "notistack";

export default function useToasts() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  function displayToast(
    msg,
    type,
    anchor = { vertical: "top", horizontal: "center" }
  ) {
    return enqueueSnackbar(msg, {
      variant: type,
      autoDismiss: true,
      anchorOrigin: {
        vertical: anchor.vertical,
        horizontal: anchor.horizontal,
      },
    });
  }
  return [displayToast];
}