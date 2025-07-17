import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { usePage } from "@inertiajs/react";

function Dashboard() {

    const {props} = usePage()

    console.log(props)


    return ( 

        <DashboardLayout>
            <h1>hi</h1>
        </DashboardLayout>
     );
}

export default Dashboard;