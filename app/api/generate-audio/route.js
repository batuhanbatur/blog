// Audio generation has been retired. Existing recordings remain available.
export async function POST() {
  return Response.json(
    { error: "Audio generation is no longer available" },
    { status: 410 },
  )
}
