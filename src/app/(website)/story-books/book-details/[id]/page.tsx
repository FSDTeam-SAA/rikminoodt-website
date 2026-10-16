import StoryDetails from "../../_components/StoryDetails";

const BookDetailsPage = ({ params }: { params: { id: string } }) => {
  return <StoryDetails storyId={params.id} />;
};

export default BookDetailsPage;
