import HeaderLink from 'components/HeaderLink';
import './Header.css'

export default function Header ()
{
  return (
    <header className='Header'>
      <nav>
        <HeaderLink url="/Home">Home</HeaderLink>
        <HeaderLink url="/Exercicio">Favoritos</HeaderLink>
        <HeaderLink url="/Alongamentos">Favoritos</HeaderLink>
        <HeaderLink url="/Rotina">Favoritos</HeaderLink>
        <HeaderLink url="/Ajuda">Favoritos</HeaderLink>
        <HeaderLink url="/Login">Favoritos</HeaderLink>
      </nav>
    </header>
  );
}