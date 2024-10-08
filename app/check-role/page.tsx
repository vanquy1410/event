import { getRole, isOrganizer } from '@/utils/roles'

export default function CheckRolePage() {
  const role = getRole()
  const organizerStatus = isOrganizer()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra Role</h1>
      <p className="mb-2">Role hiện tại của bạn: <strong>{role || 'Không xác định'}</strong></p>
      <p>Bạn {organizerStatus ? 'là' : 'không phải là'} organizer.</p>
    </div>
  )
}
