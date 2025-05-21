export default function Page() {
    if(typeof window !== 'undefined') {
        console.log('Contexto do Client')
    } else {
        console.log('Contexto do Server')
    }
    return <h1>Banda ID ...</h1>
}