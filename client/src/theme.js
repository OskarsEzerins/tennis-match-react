import { green, blue, grey, red, orange } from '@material-ui/core/colors'
import { createTheme } from '@material-ui/core/styles'

const WHITE = '#FFFFFF'
const BLACK = '#000000'

const BASE_PALETTE = {
  primary: {
    main: green[700], // Tennis court green
    contrastText: WHITE
  },
  secondary: {
    main: orange[500], // Tennis ball orange
    contrastText: BLACK
  },
  error: {
    main: red[500]
  },
  warning: {
    main: orange[700]
  },
  info: {
    main: blue[500]
  },
  success: {
    main: green[500]
  }
}

const LIGHT_PALETTE = {
  background: {
    paper: grey[100],
    default: WHITE
  },
  text: {
    primary: grey[900],
    secondary: grey[700]
  }
}

const DARK_PALETTE = {
  primary: {
    main: green[300],
    contrastText: BLACK
  },
  secondary: {
    main: orange[300],
    contrastText: BLACK
  },
  background: {
    paper: BLACK,
    default: BLACK
  },
  text: {
    primary: WHITE,
    secondary: grey[500]
  }
}

export const TennisTheme = (prefersDarkMode) => {
  return createTheme({
    palette: {
      ...BASE_PALETTE,
      ...(prefersDarkMode ? DARK_PALETTE : LIGHT_PALETTE),
      type: prefersDarkMode ? 'dark' : 'light'
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        color: prefersDarkMode ? WHITE : grey[900]
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        color: prefersDarkMode ? WHITE : grey[900]
      },
      body1: {
        fontSize: '1rem',
        color: prefersDarkMode ? grey[300] : grey[800]
      },
      button: {
        textTransform: 'none',
        fontWeight: 500
      }
    },
    spacing: 8,
    overrides: {
      MuiButton: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px'
        },
        containedPrimary: {
          backgroundColor: BASE_PALETTE.primary.main,
          color: BASE_PALETTE.primary.contrastText,
          '&:hover': {
            backgroundColor: prefersDarkMode ? green[500] : green[900]
          }
        },
        containedSecondary: {
          backgroundColor: BASE_PALETTE.secondary.main,
          color: BASE_PALETTE.secondary.contrastText,
          '&:hover': {
            backgroundColor: prefersDarkMode ? orange[500] : orange[900]
          }
        }
      },
      MuiAppBar: {
        colorPrimary: {
          backgroundColor: prefersDarkMode ? grey[900] : green[700]
        }
      },
      MuiPaper: {
        elevation1: {
          boxShadow: prefersDarkMode ? '0px 1px 3px rgba(0, 0, 0, 0.2)' : '0px 1px 3px rgba(0, 0, 0, 0.12)'
        }
      },
      MuiChip: {
        root: {
          borderRadius: '4px',
          fontWeight: 500
        },
        colorPrimary: {
          backgroundColor: BASE_PALETTE.primary.main,
          color: BASE_PALETTE.primary.contrastText
        },
        colorSecondary: {
          backgroundColor: BASE_PALETTE.secondary.main,
          color: BASE_PALETTE.secondary.contrastText
        }
      }
    }
  })
}
