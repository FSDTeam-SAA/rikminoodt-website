import { Suspense } from "react";
import StoryDetails from "../../_components/StoryDetails";
import StoryDetailsSkeleton from "../../_components/StoryDetailsSkeleton";

const BookDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <Suspense fallback={<StoryDetailsSkeleton />}>
      <StoryDetails storyId={params.id} />
    </Suspense>
  );
};

export default BookDetailsPage;
