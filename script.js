const container = document.querySelector('.shutter-container');
        const layers = document.querySelectorAll('.text-layer');

        // ✨ 부드러운 애니메이션을 위한 변수 추가
        let targetProgress = 0;  // 실제 스크롤 위치에 따른 목표값
        let currentProgress = 0; // 화면에 렌더링되는 현재값 (목표값을 부드럽게 따라감)
        
        // 부드러움의 강도 (0.01 ~ 1 사이. 숫자가 작을수록 더 느리고 부드럽게 따라옵니다)
        const easeFactor = 0.06; 

        // 1. 스크롤할 때 '목표 위치(targetProgress)'만 업데이트합니다.
        function updateTarget() {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const totalScrollDistance = rect.height - viewportHeight;

            if (rect.top <= 0) {
                targetProgress = Math.abs(rect.top) / totalScrollDistance;
            } else {
                targetProgress = 0;
            }

            // 0 ~ 1 사이로 제한
            targetProgress = Math.max(0, Math.min(1, targetProgress));
        }

        window.addEventListener('scroll', updateTarget);

        // 2. 무한 루프를 돌며 현재 위치를 목표 위치로 부드럽게 이동시킵니다 (Lerp)
        function render() {
            // 핵심 로직: 현재 값에서 목표 값으로 easeFactor 비율만큼만 매 프레임 이동
            currentProgress += (targetProgress - currentProgress) * easeFactor;

            // 끝부분에서 살짝 더 가속/감속 효과를 주기 위한 Easing 추가
            const easeY = 1 - Math.pow(1 - currentProgress, 3); 

            layers.forEach((layer, index) => {
                const distanceToMove = -index * 10; 
                const currentY = distanceToMove * easeY;
                
                layer.style.transform = `translateY(${currentY}vh)`;
            });

            // 브라우저 프레임에 맞춰 지속적으로 render 함수 호출
            requestAnimationFrame(render);
        }

        // 애니메이션 루프 시작
        render();