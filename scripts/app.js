(function () {
  var categories = [
    { name: 'Safety', questions: [
      { value: 100, question: 'Name one daily safety check.', answer: 'Verify PPE and workstation hazards.', learnMore: 'Daily checks prevent incidents and speed issue reporting.' },
      { value: 200, question: 'What is a near-miss?', answer: 'An event that could have caused harm but did not.', learnMore: 'Reporting near-misses helps eliminate latent risks.' },
      { value: 300, question: 'Who can stop unsafe work?', answer: 'Any team member can stop unsafe activity.', learnMore: 'Stop-work authority is universal across teams.' },
      { value: 400, question: 'When do you escalate risk?', answer: 'Escalate immediately when controls are absent.', learnMore: 'Escalation improves response time and ownership.' },
      { value: 500, question: 'Define hazard control hierarchy.', answer: 'Eliminate, substitute, engineer, administrate, PPE.', learnMore: 'Use highest feasible control first for impact.' }
    ]},
    { name: 'Quality', questions: [
      { value: 100, question: 'What does first-pass yield track?', answer: 'Work completed correctly the first time.', learnMore: 'High first-pass yield reduces rework cost.' },
      { value: 200, question: 'Why use checklists?', answer: 'They reduce omission errors.', learnMore: 'Checklist consistency supports audit readiness.' },
      { value: 300, question: 'What is root-cause analysis for?', answer: 'Finding underlying causes, not symptoms.', learnMore: 'RCA prevents recurring defects over quick fixes.' },
      { value: 400, question: 'When should documentation be updated?', answer: 'Immediately after process changes.', learnMore: 'Live documentation aligns teams and training.' },
      { value: 500, question: 'Define acceptance criteria.', answer: 'Conditions that determine completion quality.', learnMore: 'Shared criteria reduce dispute and delay.' }
    ]},
    { name: 'Ops', questions: [
      { value: 100, question: 'What is throughput?', answer: 'Amount of work completed per period.', learnMore: 'Throughput trends reveal bottlenecks early.' },
      { value: 200, question: 'What does WIP mean?', answer: 'Work in progress currently active.', learnMore: 'WIP limits improve focus and flow.' },
      { value: 300, question: 'What is handoff risk?', answer: 'Information loss during transfer.', learnMore: 'Standard handoff templates lower coordination risk.' },
      { value: 400, question: 'Why track cycle time?', answer: 'To measure delivery speed and variability.', learnMore: 'Cycle time supports realistic planning.' },
      { value: 500, question: 'What is a runbook?', answer: 'A step-by-step operational procedure.', learnMore: 'Runbooks reduce downtime in high-pressure events.' }
    ]},
    { name: 'Compliance', questions: [
      { value: 100, question: 'Why retain records?', answer: 'To meet policy and legal requirements.', learnMore: 'Retention schedules simplify audits.' },
      { value: 200, question: 'What is least privilege?', answer: 'Users get minimum access needed.', learnMore: 'Least privilege limits blast radius on incidents.' },
      { value: 300, question: 'How often review permissions?', answer: 'At regular intervals and role changes.', learnMore: 'Access reviews catch dormant privilege drift.' },
      { value: 400, question: 'What is attestations purpose?', answer: 'Confirm required controls are active.', learnMore: 'Attestations create accountability evidence.' },
      { value: 500, question: 'What is policy exception tracking?', answer: 'Documenting approved temporary deviations.', learnMore: 'Exception logs ensure expiry and revalidation.' }
    ]},
    { name: 'Culture', questions: [
      { value: 100, question: 'Why run retrospectives?', answer: 'To reflect and improve team outcomes.', learnMore: 'Retros uncover process and communication friction.' },
      { value: 200, question: 'What is psychological safety?', answer: 'Freedom to speak up without fear.', learnMore: 'Psychological safety boosts problem visibility.' },
      { value: 300, question: 'Why celebrate small wins?', answer: 'It reinforces progress and motivation.', learnMore: 'Recognition supports sustained engagement.' },
      { value: 400, question: 'What is cross-training?', answer: 'Learning adjacent roles and duties.', learnMore: 'Cross-training improves resiliency and coverage.' },
      { value: 500, question: 'What makes feedback effective?', answer: 'Specific, timely, actionable observations.', learnMore: 'Great feedback drives clear behavior change.' }
    ]}
  ];

  var board = document.getElementById('board');
  var qaModal = document.getElementById('qa-modal');
  var scorePopup = document.getElementById('score-popup');
  var abbreviationsModal = document.getElementById('abbreviations-modal');
  var referencesModal = document.getElementById('references-modal');
  var state = document.getElementById('view-state');

  var qaCategory = document.getElementById('qa-category');
  var qaValue = document.getElementById('qa-value');
  var qaContent = document.getElementById('qa-content');
  var qaLearn = document.getElementById('qa-learn');

  var showAnswer = document.getElementById('show-answer');
  var showLearn = document.getElementById('show-learn-more');
  var openScorePopup = document.getElementById('open-score-popup');
  var closeQa = document.getElementById('close-qa');

  var scoreValue = document.getElementById('score-value');
  var closeScore = document.getElementById('close-score');

  var current = null;
  var phase = 'question';

  function setView(text) {
    state.textContent = text;
  }

  function openModal(modal, title) {
    modal.classList.remove('hidden');
    setView(title);
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
    if (
      qaModal.classList.contains('hidden') &&
      scorePopup.classList.contains('hidden') &&
      abbreviationsModal.classList.contains('hidden') &&
      referencesModal.classList.contains('hidden')
    ) {
      setView('Board');
    }
  }

  function setQuestionPhase(nextPhase) {
    phase = nextPhase;
    if (!current) return;

    if (phase === 'question') {
      qaContent.textContent = current.question;
      qaLearn.classList.add('hidden');
      showAnswer.disabled = false;
      showLearn.classList.add('hidden');
      showLearn.disabled = true;
      openScorePopup.classList.add('hidden');
      openScorePopup.disabled = true;
      showAnswer.focus();
      return;
    }

    if (phase === 'answer') {
      qaContent.textContent = current.answer;
      showAnswer.disabled = true;
      showLearn.classList.remove('hidden');
      showLearn.disabled = false;
      openScorePopup.classList.add('hidden');
      openScorePopup.disabled = true;
      showLearn.focus();
      return;
    }

    if (phase === 'learn-more') {
      qaLearn.textContent = current.learnMore;
      qaLearn.classList.remove('hidden');
      showLearn.disabled = true;
      openScorePopup.classList.remove('hidden');
      openScorePopup.disabled = false;
      openScorePopup.focus();
      return;
    }
  }

  function renderBoard() {
    board.innerHTML = '';

    categories.forEach(function (category) {
      var categoryCell = document.createElement('div');
      categoryCell.className = 'category';
      categoryCell.textContent = category.name;
      board.appendChild(categoryCell);
    });

    for (var row = 0; row < 5; row += 1) {
      categories.forEach(function (category, categoryIndex) {
        var q = category.questions[row];
        var tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'tile';
        tile.textContent = q. value;
        tile.setAttribute('role', 'gridcell');
        tile.setAttribute('aria-label', category.name + ' for ' + q.value + ' points');
        tile.dataset.category = String(categoryIndex);
        tile.dataset.question = String(row);

        if (q.completed) {
          tile.disabled = true;
          tile.classList.add('completed');
          tile.setAttribute('aria-label', category.name + ' for ' + q.value + ' points completed');
        }

        tile.addEventListener('click', function (event) {
          var target = event.currentTarget;
          var selected = categories[Number(target.dataset.category)].questions[Number(target.dataset.question)];
          current = selected;
          qaCategory.textContent = category.name;
          qaValue.textContent = q.value + ' points';
          setQuestionPhase('question');
          openModal(qaModal, 'Question');
        });

        board.appendChild(tile);
      });
    }
  }

  showAnswer.addEventListener('click', function () {
    setQuestionPhase('answer');
    setView('Answer');
  });

  showLearn.addEventListener('click', function () {
    setQuestionPhase('learn-more');
    setView('Learn more');
  });

  openScorePopup.addEventListener('click', function () {
    scoreValue.textContent = String(current.value);
    openModal(scorePopup, 'Scoring detail');
  });

  closeScore.addEventListener('click', function () {
    closeModal(scorePopup);
    if (!qaModal.classList.contains('hidden') && phase === 'learn-more') {
      setView('Learn more');
    }
  });

  closeQa.addEventListener('click', function () {
    if (current) {
      current.completed = true;
      renderBoard();
    }
    current = null;
    closeModal(scorePopup);
    closeModal(qaModal);
  });

  document.getElementById('open-abbreviations').addEventListener('click', function () {
    openModal(abbreviationsModal, 'Abbreviations');
  });

  document.getElementById('open-references').addEventListener('click', function () {
    openModal(referencesModal, 'References');
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (button) {
    button.addEventListener('click', function () {
      closeModal(document.getElementById(button.getAttribute('data-close-modal')));
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      [scorePopup, qaModal, abbreviationsModal, referencesModal].forEach(closeModal);
    }
  });

  renderBoard();
})();
