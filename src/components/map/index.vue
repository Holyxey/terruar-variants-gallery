<template>
  <article
    class="no-scrollbar mx-auto my-10 flex max-w-7xl flex-col gap-4 overflow-x-auto md:my-12 md:gap-10 lg:flex-row"
  >
    <MapHousePopup :title="chosenVariant" @clear="chosenVariant = undefined" />

    <!-- Headers -->
    <div
      class="sticky left-0 min-w-xs space-y-2 text-balance text-white md:py-4 lg:order-1 lg:max-w-[30%]"
    >
      <p class="font-serif text-xl font-light lg:text-3xl">
        Выберите домик на карте
      </p>

      <p class="font-light">
        Стандартные домики идеальны для романтических выходных вдвоем, есть
        мини-кухня и санузел. В домике студии дополнительно будет еще панорамное
        окно с видом на лес и мангальную зону с уличной мебелью. В домиках
        повышенной комфортности — еще больше тепла и уюта, мангальная зона с
        навесом, большая кровать, теплый пол
      </p>

      <UiButton is="a" href="?znms_widget_open=5428">Забронировать</UiButton>
    </div>

    <!-- Map -->
    <div :class="['relative min-w-2xl']">
      <img
        src="https://static.tildacdn.com/tild6336-3032-4337-b466-616539326634/Screenshot_2026-06-0.png"
        alt="Терруар глэмпинг в Тульской области карта территории"
        class="rounded-xl md:rounded-4xl"
      />

      <div ref="Company">
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Шампань"
          :type="Category.Company"
          class="absolute"
          style="width: 6%; top: 26%; left: 19%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Валенсия"
          :type="Category.Company"
          class="absolute"
          style="width: 6%; top: 12.5%; right: 7.5%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Медок"
          :type="Category.Company"
          class="absolute"
          style="width: 6%; top: 11.5%; right: 0.8%"
        />
      </div>

      <div ref="Standart">
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Риоха"
          :type="Category.Standart"
          class="absolute"
          style="width: 5%; bottom: 29%; right: 40%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Риоха"
          :type="Category.Standart"
          class="absolute"
          style="width: 5%; bottom: 12%; right: 41.5%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Риоха"
          :type="Category.Standart"
          class="absolute"
          style="width: 5%; bottom: 18%; right: 35%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Риоха"
          :type="Category.Standart"
          class="absolute"
          style="width: 5%; bottom: 24%; right: 48.2%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Риоха"
          :type="Category.Standart"
          class="absolute"
          style="width: 5%; bottom: 12%; right: 49%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Риоха"
          :type="Category.Standart"
          class="absolute"
          style="width: 5%; bottom: 11.5%; right: 57%"
        />
      </div>

      <div ref="Elevated">
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Мендоза"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; top: 13%; right: 13.8%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Апулия"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; top: 14%; right: 20%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Этна"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; top: 15%; right: 26.3%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Лаура"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; top: 16%; right: 32.5%"
        />

        <!-- Napa -->
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Напа"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; bottom: 11.5%; left: 12%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Напа"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; bottom: 36%; left: 8.5%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Напа"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; bottom: 35%; left: 16.5%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Напа"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; bottom: 22.5%; left: 20.5%"
        />
        <MapHouse
          @chosen-title="foundAndChoose"
          variant-title="Напа"
          :type="Category.Elevated"
          class="absolute"
          style="width: 5%; bottom: 23%; left: 5.5%"
        />
      </div>

      <div ref="Studio">
        <MapHouse
          variant-title="Бордо"
          @chosen-title="foundAndChoose"
          :type="Category.Studio"
          class="absolute"
          style="width: 5%; top: 13.5%; left: 23.3%"
        />
        <MapHouse
          variant-title="Рейнау"
          @chosen-title="foundAndChoose"
          :type="Category.Studio"
          class="absolute"
          style="width: 5%; top: 13.5%; left: 29%"
        />
        <MapHouse
          variant-title="Бургундия"
          @chosen-title="foundAndChoose"
          :type="Category.Studio"
          class="absolute"
          style="width: 5%; top: 13.5%; left: 36%"
        />
        <MapHouse
          variant-title="Тоскана"
          @chosen-title="foundAndChoose"
          :type="Category.Studio"
          class="absolute"
          style="width: 5%; top: 17%; left: 42%"
        />
        <MapHouse
          variant-title="Прованс"
          @chosen-title="foundAndChoose"
          :type="Category.Studio"
          class="absolute"
          style="width: 5%; top: 12%; left: 48%"
        />
      </div>

      <div ref="Tent">
        <MapHouse
          variant-title="Глэмпинг с перс.душем"
          @chosen-title="foundAndChoose"
          :type="Category.Tent"
          class="absolute"
          style="width: 5%; bottom: 30.5%; right: 9.8%"
        />
        <MapHouse
          variant-title="Глэмпинг с перс.душем"
          @chosen-title="foundAndChoose"
          :type="Category.Tent"
          class="absolute"
          style="width: 5%; bottom: 22.3%; right: 16.3%"
        />
        <MapHouse
          variant-title="Глэмпинг с перс.душем"
          @chosen-title="foundAndChoose"
          :type="Category.Tent"
          class="absolute"
          style="width: 5%; bottom: 25.5%; right: 28.5%"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { useTemplateRef, ref } from 'vue';
  import { Category } from '../../assets/variants';
  import MapHouse from './MapHouse.vue';
  import MapHousePopup from './MapHousePopup.vue';
  import UiButton from '../ui/UiButton.vue';

  const company = useTemplateRef('Company');
  const standart = useTemplateRef('Standart');
  const elevated = useTemplateRef('Elevated');
  const studio = useTemplateRef('Studio');
  const tent = useTemplateRef('Tent');

  const chosenVariant = ref<string>();
  function foundAndChoose(title: string) {
    chosenVariant.value = title;
  }
</script>
