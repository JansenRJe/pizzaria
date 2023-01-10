import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'

//função para pagina que só pode ser acessada por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);
        // se tentar acessar a pagina porem tendo ja um cadstro redirecionamos
        if(cookies['@nextauth.token'])
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false,
                }
            }

        return await fn(ctx);
    }
}