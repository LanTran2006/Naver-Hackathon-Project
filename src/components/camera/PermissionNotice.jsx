function PermissionNotice({ onGrant }) {
  return (
    <div className="max-w-3xl mx-auto bg-green-50 rounded-lg p-8 mb-6 shadow-sm">
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-6">
          Cấp quyền truy cập camera để bắt đầu ghi hình
        </p>
        <button
          onClick={onGrant}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-base font-semibold shadow-md"
        >
          Cấp quyền
        </button>
      </div>
    </div>
  );
}

export default PermissionNotice;
