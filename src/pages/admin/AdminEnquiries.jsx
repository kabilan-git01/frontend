import { useApp } from '../../context/AppProvider';

export default function AdminEnquiries() {
  const { enquiries, updateEnquiryStatus } = useApp();

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">Contact Enquiries</h1>

      <div className="space-y-4">
        {enquiries.length === 0 ? (
          <p className="text-titan-muted">No enquiries yet.</p>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-heading font-bold">{enquiry.name}</h3>
                  <p className="text-titan-secondary text-sm">{enquiry.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-titan-muted text-xs">{enquiry.date}</span>
                  <select
                    value={enquiry.status}
                    onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                    className="input-field !py-1 !text-xs w-auto"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-sm font-semibold text-titan-red mb-2">{enquiry.subject}</p>
              <p className="text-titan-secondary text-sm">{enquiry.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
