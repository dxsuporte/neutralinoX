let getUsername = async () => {
  const startWindow = NL_CWD + "/bin/startApp.exe";
  const startLinux = NL_CWD + "/bin/startApp";
  const startApp = NL_OS == "Windows" ? startWindow : startLinux;
  try {
    await Neutralino.os.execCommand(startApp, { background: true });
  } catch (err) {
    console.error(err);
  }
};

let setTray = async () => {
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/favicon.png",
    menuItems: [
      { id: "Abrir", text: "Abrir" },
      { id: "Sobre", text: "Sobre" },
      { id: "Sair", text: "Sair" },
    ],
  };
  Neutralino.os.setTray(tray);
};

let onTrayMenuItemClicked = async (event) => {
  switch (event.detail.id) {
    case "Abrir":
      Neutralino.os.open("http://localhost:3333");
      break;
    case "Sobre":
      Neutralino.os.showMessageBox(
        "Sobre",
        "Neutralinojs server: | Neutralinojs client:",
        "OK",
        "WARNING"
      );
      break;
    case "Sair":
      const stopApp = NL_OS == "Windows" ? "tskill startApp" : "pkill startApp";
      try {
        let info = await Neutralino.os.execCommand(stopApp, {
          background: true,
        });
        if (info) {
          Neutralino.app.exit();
        }
      } catch (err) {
        console.error(err);
      }
      break;
  }
};

let onWindowClose = async () => {
  const stopApp = NL_OS == "Windows" ? "tskill startApp" : "pkill startApp";
  try {
    let info = await Neutralino.os.execCommand(stopApp, { background: true });
    if (info) {
      Neutralino.app.exit();
    }
  } catch (err) {
    console.error(err);
  }
};

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if (NL_OS != "Darwin") {
  setTray();
}

getUsername();
