import CoverLogo from '../images/dlogo.svg';

export default function CompanyInvoiceHeader(){
    return <div className="flex items-center justify-between">
        <div className="flex-grow">
            <img src="" className="h-40 w-40" alt="cover logo"/>
        </div>
        <div className="flex flex-col">
            <b>Company Name here</b>
            <span className="text-xs">No. 41 5th Avenue, Kwarteng Estates</span>
            <span className="text-xs">Old Ashongman</span>
            <span className="text-xs">GT - 121-3916</span>
        </div>
    </div>
}