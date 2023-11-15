import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState([]); 
    const [loaded, setLoaded] = useState(false)

    useEffect(()=>{
        const fetchData = async () =>{
            await fetch(url)
            .then((res)=> res.json())
            .then((data)=> setData(data))
            setLoaded(true)
        }
        fetchData()
    },[url])

    return { loaded, data }
}

export default useFetch