import HomeLayout from "@/layout/HomeLayout"
export default function Dashboard({ user }){
    console.log(user)
    return (
        <>Hello Customer</>
    )
}

Dashboard.layout = page => <HomeLayout children={ page }/>