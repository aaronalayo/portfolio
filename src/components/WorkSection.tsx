import VideosSection from './VideosSection';
import PhotosSection from './PhotosSection';
import DeveloperWorkSection from './DeveloperWorkSection';

const WorkSection = () => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-2">Work</h2>
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Videos</h3>
        <VideosSection />
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Photos</h3>
        <PhotosSection />
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Developer Work</h3>
        <DeveloperWorkSection />
      </div>
    </div>
  </section>
);

export default WorkSection; 