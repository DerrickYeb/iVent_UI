export default function PaymentReceivedAttachedFiles({files}) {
    return files && files.length > 0 ? <div className="grid grid-cols-4 gap-4">
        {files.map((f, _) => <img src={f?.FileUrl} className="h-12 w-12 rounded-lg" alt=""/>)}
    </div> : <div>
        <span>Not available</span>
    </div>
}