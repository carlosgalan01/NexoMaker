import { Hero } from "@/components/home/hero";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { ProductRails } from "@/components/home/product-rails";
import { AssistScrollytelling } from "@/components/home/assist-scrollytelling";
import { ProjectConfigurator } from "@/components/home/project-configurator";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryCarousel />
      <ProductRails />
      <AssistScrollytelling />
      <ProjectConfigurator />
    </main>
  );
}
