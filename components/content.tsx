import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/motion-primitives/carousel';
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Book, GraduationCap, Trophy } from "lucide-react";

const carouselItems = [
  {
    icon: <div className="p-2 bg-secondary rounded-full flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-secondary-foreground" />
          </div>,
    title: "AI Sentiment Analysis",
    description: "Get instant insights into the sentiment of the students using Echo Mind AI.",
  },
  {
    icon: <div className="p-2 bg-accent rounded-full flex items-center justify-center">
            <Book className="w-8 h-8 text-accent-foreground" />
          </div>,
    title: "Evaluation Tools",
    description: "Students can evaluate their professors performance using our evaluation tools.",
  },
  {
    icon: <div className="p-2 bg-primary rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>,
    title: "Leaderboards",
    description: "Professors will have their leaderboards updated and manage by the admin",
  },
  {
    icon: <div className="p-2 bg-muted rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-muted-foreground" />
          </div>,
    title: "Successful insights",
    description: "Echo Mind AI will provide successful insights to the professors and admin.",
  },
];

export function CarouselBasic() {
  return (
    <div className="relative w-full max-w-xl md:max-w-md lg:max-w-lg mx-auto">
      <Carousel>
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className='p-4'>
              <Card className="flex flex-col items-center justify-center p-8 text-center bg-card shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 p-0">
                  {item.icon}
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation alwaysShow />
        <CarouselIndicator />
      </Carousel>
    </div>
  );
}