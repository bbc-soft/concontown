// app/(auth)/terms/detail/page.tsx
'use client';

import BackButton from '../../../../../components/common/BackButton';

export default function TermsDetailPage() {
  return (
    <div className="min-h-screen px-5 pt-12 pb-6 bg-white">
      <BackButton />

      <div className="mt-8">
        <h1 className="text-base font-bold mb-4">Terms of Use</h1>

        <div className="h-[500px] overflow-y-auto p-4 border border-gray-200 rounded-lg text-[16px] leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
            purus vel ex tincidunt ultrices. Donec convallis, velit sed
            ultricies euismod, sem purus tempor justo, a egestas est justo a
            ligula. Integer non orci nec lorem aliquam facilisis. Suspendisse
            potenti. Proin id cursus metus. Integer quis fermentum risus. Sed
            blandit, metus nec pretium fermentum, orci leo cursus mi, nec
            ultrices eros eros vitae nulla. Curabitur eget metus id turpis
            tristique eleifend.
          </p>
          <p className="mt-4">
            Mauris ac nunc vel massa blandit efficitur. Integer vitae justo a
            diam sollicitudin vehicula ut sed nibh. Pellentesque in suscipit
            nunc, ac tristique odio. Sed semper libero nec augue pretium
            suscipit. Suspendisse potenti. Curabitur malesuada nisi vel purus
            porta, ac pulvinar augue cursus. Duis finibus diam at magna
            consectetur, vitae blandit risus fermentum.
          </p>
        </div>
      </div>
    </div>
  );
}
