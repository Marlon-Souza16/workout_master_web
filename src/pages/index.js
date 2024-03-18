import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import HeaderLink from "@/components/HeaderLink";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Header>
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
      </Header>
      
    </>
  );
}
