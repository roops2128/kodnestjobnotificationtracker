interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-5">
      <div className="text-center">
        <h1 className="font-serif text-display text-foreground">{title}</h1>
        <p className="mt-2 text-body text-muted-foreground max-w-prose mx-auto">
          This section will be built in the next step.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
