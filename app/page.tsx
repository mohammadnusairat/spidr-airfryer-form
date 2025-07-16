import InterestForm from './components/InterestForm';
import ParticleNetwork from './components/ParticleNetwork';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative">
      <ParticleNetwork />
      <InterestForm />
    </div>
  );
}
