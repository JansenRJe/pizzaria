import { useState, ChangeEvent } from "react";
import Head from "next/head";
import styles from './styles.module.scss'
import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";

import { FiUpload } from 'react-icons/fi'

import { api } from "../../services/apiClient";
import { setupAPIClient } from "../../services/api";

type ItemProps = {
    id:string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps){

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelect] = useState(0)

    function handleFile(e: ChangeEvent<HTMLInputElement>){

        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type  === 'image/jpeg' || image.type === 'image/png'){

            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))

        }
    }

    function handleChangeCategory(event){
        //console.log('Categoria selecionada ', categories[event.target.value])
        setCategorySelect(event.target.value)
    }

    return(
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>
            
            <div>
                <Header/>
                
                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={25} color="#FFF"/>
                            </span>
                            
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                            {avatarUrl &&(
                                <img 
                                className={styles.preview}
                                src={avatarUrl} 
                                alt="foto do produto" 
                                width={250} 
                                height={250}
                                />
                            )}
                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory} >
                            {categories.map( (item, index) =>{
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input 
                            type="text" 
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                        />

                        <input 
                            type="text" 
                            placeholder="Preço do produto"
                            className={styles.input}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Descreva o produto"
                            className={styles.input}
                        />

                        <button 
                            className={styles.buttonAdd} 
                            type="submit">
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category')

    //console.log(response.data);

    return {
        props: {
            categoryList: response.data
        }
    }
})