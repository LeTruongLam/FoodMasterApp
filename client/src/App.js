import { Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import AppContextProvider from "./context/AppContext";
import MonDo from "./components/mondo/MonDo";
import CongThuc from "./components/congthuc/CongThuc";
import DiCho from "./components/dicho/DiCho";
// import NauAn from "./components/nauan/NauAn";
import Kho from "./components/kho/Kho";
import Admin from "./components/admin/Admin";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <Switch>
          <Route path="/dang-nhap" exact component={SignIn} />
          <Route path="/dang-ky" exact component={SignUp} />
          <Main>
            <Route path="/mon-do" exact component={MonDo} />
            <Route path="/cong-thuc" exact component={CongThuc} />
            <Route path="/di-cho" exact component={DiCho} />
            <Route path="/kho" exact component={Kho} />
            <Route path="/quan-tri" exact component={Admin} />
            <Redirect from="*" to="/kho" />
          </Main>
        </Switch>
      </div>
    </AppContextProvider>
  );
}

export default App;
