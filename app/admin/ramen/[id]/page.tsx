import RamenForm from '../../_components/RamenForm'

export default function EditRamenPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">라멘 수정</h1>
        <RamenForm ramenId={params.id} />
      </div>
    </div>
  )
}
