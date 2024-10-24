import { getRole, isEmployee } from '@/utils/roles'

export default function EmployeePage() {
  const role = getRole()
  const employeeStatus = isEmployee()
  const isAdmin = role === 'admin'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trang Nhân viên</h1>
      <p className="mb-2">Role hiện tại của bạn: <strong>{role || 'Không xác định'}</strong></p>
      <p>Bạn {employeeStatus || isAdmin ? 'có' : 'không có'} quyền truy cập trang này.</p>
      {employeeStatus || isAdmin ? (
        <p className="mt-4">Chào mừng bạn đến với trang dành cho nhân viên!</p>
      ) : (
        <p className="mt-4 text-red-600">Bạn không có quyền truy cập trang này. Vui lòng liên hệ admin để được cấp quyền.</p>
      )}
    </div>
  )
}
