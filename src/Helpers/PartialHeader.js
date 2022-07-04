export default function PartialHeader({icon, title}){
    return <div className="bg-white p-2 flex items-center space-x-2">
        <div>{icon}</div>
        <div className="font-medium">{title}</div>
    </div>
}