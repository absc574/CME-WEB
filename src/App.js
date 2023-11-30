import './App.css';
import {useAuth0} from "@auth0/auth0-react";
import Background from './components/Background';
import Header from './components/Header';
import Content from './components/Content';
import ExternalApi from './components/ExternalApi';
import Footer from './components/Footer';


function App() {
  const {error} = useAuth0();

  return (
    <div>
      <Background />
      <Header />
      <Content />
      <ExternalApi />
      <Footer/>
    </div>
  );
}

export default App;
