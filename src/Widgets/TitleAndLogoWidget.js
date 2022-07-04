import LogoImg from '../images/dlogo.svg';
export default function TitleAndLogoWidget(){
        return <div className="flex items-center space-x-3">
            <div className="bg-white pl-4">
                <img src='' className="object-cover w-28 h-auto" alt={""}/>
            </div>

            <h2 className={"font-semibold text-xl text-white"}>Inventory Management</h2>
        </div>
}