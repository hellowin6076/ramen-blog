import RamenForm from '../../_components/RamenForm'

export default function NewRamenPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">새 라멘 추가</h1>
        <RamenForm />
      </div>
    </div>
  )
}
