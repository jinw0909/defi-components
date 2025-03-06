import logo from './logo.svg';
import './App.css';
import {MyPage, WalletConnect} from "./screens";
import {WalletProvider} from "./context/WalletContext";
import { Provider } from 'react-redux';
import store from "./context/store";

function App() {
  return (
    <div className="App">
        <WalletProvider store={store}>
            <WalletConnect/>
            <MyPage/>
        </WalletProvider>
    </div>
  );
}

export default App;
