interface Props {
    params: {
        trackId: string
    }
}

export default async function Page({ params }: Props) {
    const p = await params
    return <h1>Música ID {p.trackId}</h1>
}